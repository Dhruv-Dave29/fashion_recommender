from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CSV data for H&M products
df_hm = pd.read_csv("hm_products2.csv").fillna("")  # Fill NaN values

# Load CSV data for Ulta & Sephora products
df_sephora = pd.read_csv("ulta_sephora_with_mst_index.csv").fillna("")


@app.get("/")
def home():
    return {"message": "Welcome to the API!"}


@app.get("/api/random-outfits")
async def get_random_outfits(limit: int = Query(default=8)):
    """Get random outfits from H&M dataset."""
    try:
        # Randomly sample products from the H&M dataset
        random_products = df_hm.sample(n=min(limit, len(df_hm))).to_dict(orient="records")
        
        # Clean up the data
        cleaned_products = []
        for product in random_products:
            cleaned_products.append({
                "Product Name": product.get("Product Name", ""),
                "Price": product.get("Price", "$29.99"),
                "Image URL": product.get("Image URL", ""),
                "Product Type": product.get("Product Type", "")
            })
        
        return {
            "data": cleaned_products,
            "total_items": len(cleaned_products)
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}


# 📌 **H&M Products API**
@app.get("/products")
def get_products(product_type: str = Query(None), random: bool = Query(False)):
    """Fetch H&M products filtered by product type."""
    filtered_df = df_hm.copy()
    
    if product_type:
        # Split product types by comma and create regex pattern
        types = product_type.split(',')
        pattern = '|'.join(types)
        filtered_df = filtered_df[
            filtered_df["Product Type"].str.contains(pattern, case=False, na=False)
        ]
    
    # Always return random products for outfits
    if random or len(filtered_df) > 15:
        filtered_df = filtered_df.sample(n=min(15, len(filtered_df)))
    
    # Convert DataFrame to records
    products = filtered_df.to_dict(orient="records")
    
    # Ensure all necessary fields are present
    for product in products:
        product["Product_Name"] = product.get("Product Name", "")
        product["Brand"] = product.get("Brand", "H&M")
        product["Price"] = product.get("Price", "$29.99")
        product["Image_URL"] = product.get("Image URL", "")
    
    return products


@app.post("/api/recommendations")
async def get_recommendations(request: dict):
    """Fetch recommended H&M products based on type (makeup or outfit)."""
    filtered_df = df_hm.copy()
    
    recommendation_type = request.get("type", "makeup")

    if recommendation_type == "makeup":
        filtered_df = filtered_df[
            filtered_df["Product Type"].str.contains("makeup|cosmetic|lipstick|foundation", case=False, na=False)
        ]
    else:  # outfit recommendations
        filtered_df = filtered_df[
            filtered_df["Product Type"].str.contains("dress|top|shirt|pants", case=False, na=False)
        ]

    # Take random 15 products
    filtered_df = filtered_df.sample(n=min(15, len(filtered_df)))

    return {"products": json.loads(filtered_df.to_json(orient="records"))}


# 📌 **Ulta & Sephora Products API**
@app.get("/data/")
def get_data(
    mst: str = Query(None, description="Filter by 'mst' column"),
    page: int = Query(1, description="Page number", ge=1),
    limit: int = Query(15, description="Items per page", le=15),
):
    """Fetch paginated Ulta & Sephora makeup products."""
    # Filter by product name or description instead of Product Type
    filtered_df = df_sephora[
        df_sephora["product"].str.contains("foundation|makeup|cosmetic|lipstick", 
        case=False, 
        na=False)
    ]

    if mst:
        filtered_df = filtered_df[filtered_df["mst"] == mst]

    total_items = len(filtered_df)
    total_pages = (total_items + limit - 1) // limit
    start, end = (page - 1) * limit, (page - 1) * limit + limit

    # Convert DataFrame to records and ensure image URLs are present
    paginated_data = filtered_df.iloc[start:end].to_dict(orient="records")
    
    # Map the field names to match what the frontend expects
    for product in paginated_data:
        product["product_name"] = product.get("product", "")
        product["image_url"] = product.get("imgSrc", "")
        product["image"] = product.get("imgSrc", "")  # Backup image field
        product["price"] = product.get("price", "$29.99")
        product["brand"] = product.get("brand", "Unknown")

    return {
        "data": paginated_data,
        "page": page,
        "limit": limit,
        "total_items": total_items,
        "total_pages": total_pages,
    }
