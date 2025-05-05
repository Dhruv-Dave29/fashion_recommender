from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import math
from typing import List
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://fashion-recommender-rust.vercel.app"],  # Your React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

color_mapping = {
    "Coral Red": "Red",
    "Turquoise": "Turquoise Blue",
    "Ocean Blue": "Blue",
    "Sage Green": "Green",
    "Soft Pink": "Pink",
    "Royal Purple": "Purple",
    "Indian Red": "Red",
    "Light Sea Green": "Sea Green",
    "Royal Blue": "Blue",
    "Dark Olive Green": "Olive",
    "Medium Violet Red": "Magenta",
    "Dark Orchid": "Purple",
    "Gold": "Gold",
    "Orange Red": "Orange",
    "Spring Green": "Green",
    "Deep Pink": "Pink",
    "Indigo": "Purple",
    "Dark Orange": "Orange",
    "Navy Blue": "Navy Blue",
    "Maroon": "Maroon",
    "Olive Green": "Olive",
    "Midnight Blue": "Navy Blue",
    "Saddle Brown": "Brown",
    "Purple": "Purple",
    "Red": "Red",
    "Lime": "Green"
}

def color_distance(color1, color2):
    """Calculate Euclidean distance between two RGB colors."""
    return math.sqrt(sum((c1 - c2) ** 2 for c1, c2 in zip(color1, color2)))

# Load CSV data for H&M products
df_hm = pd.read_csv("hm_products2.csv").fillna("")  # Fill NaN values

# Load CSV data for Ulta & Sephora products
df_sephora = pd.read_csv("ulta_with_mst_index.csv").fillna("")

df_apparel = pd.read_csv("apparel.csv")

@app.get("/")
def home():
    return {"message": "Welcome to the API!"}


@app.get("/apparel")
def get_apparel(
    gender: str = Query(None, description="Filter by gender (e.g., 'Men', 'Women')"),
    color: List[str] = Query(None, description="Filter by one or more baseColour values (e.g., 'Blue', 'Black')"),
    page: int = Query(1, description="Page number (default: 1)", ge=1),
    limit: int = Query(24, description="Items per page (default: 24)", le=100)
):
    if color:
        color = [color_mapping.get(c, c) for c in color]  # Use the original value if key is not found
        color = list(set(color))  # Step 2: Remove duplicates
        color = [c for c in color if pd.notna(c)]

    filtered_df = df_apparel.copy()

    if gender:
        filtered_df = filtered_df[filtered_df["gender"] == gender]

    if color:
        filtered_df = filtered_df[filtered_df["baseColour"].isin(color)]

    # limited_df = filtered_df.groupby("baseColour").apply(lambda x: x.sample(min(len(x), 6), random_state=42)).reset_index(drop=True)

    randomized_df = filtered_df.sample(frac=1,random_state=28).reset_index(drop=True)

    # Apply overall limit of 36 items
    randomized_df = randomized_df.head(24)

    total_items = len(randomized_df)
    total_pages = (total_items + limit - 1) // limit
    start = (page - 1) * limit
    end = start + limit

    paginated_df = randomized_df.iloc[start:end]

    # Convert the paginated DataFrame to JSON
    result = paginated_df.to_dict(orient="records")

    return {
        "data": result,
        "page": page,
        "limit": limit,
        "total_items": total_items,
        "total_pages": total_pages
    }



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


# **H&M Products API**
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
        product["Price"] = product.get("Price", "$ 29.99")
        product["Image_URL"] = product.get("Image URL", "")
    
    return products


@app.post("/api/recommendations")
async def get_recommendations(request: dict):
    """Fetch recommended H&M products based on type (makeup or outfit)."""
    filtered_df1 = df_hm.copy()
    
    recommendation_type = request.get("type", "makeup")

    if recommendation_type == "makeup":
        # filtered_df = filtered_df[
        #     filtered_df["Product Type"].str.contains("makeup|cosmetic|lipstick|foundation", case=False, na=False)
        # ]
        pass
    else:  # outfit recommendations
        filtered_df1 = filtered_df1[
            filtered_df1["Product Type"].str.contains("dress|top|shirt|pants", case=False, na=False)
        ]

    # Take random 15 products
    filtered_df = filtered_df.sample(n=min(15, len(filtered_df)))

    return {"products": json.loads(filtered_df.to_json(orient="records"))}


# **Ulta & Sephora Products API**
@app.get("/data/")
def get_data(
    mst: str = Query(None, description="Filter by 'mst' column"),
    page: int = Query(1, description="Page number", ge=1),
    limit: int = Query(15, description="Items per page", le=15),
    ogcolor: str = Query(None, description="Filter by nearest colour"),
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
    # print(ogcolor)
    # filtered_df = write here
    if ogcolor:
        # Function to calculate Euclidean distance between two hex colors
        def hex_to_rgb(hex_code):
            hex_code = hex_code.lstrip('#')
            return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

        def color_distance(color1, color2):
            return sum((c1 - c2) ** 2 for c1, c2 in zip(color1, color2)) ** 0.5

        # Convert ogcolor to RGB
        target_rgb = hex_to_rgb(ogcolor)

        # Add a new column for distance calculation
        filtered_df['distance'] = filtered_df['hex'].apply(
            lambda x: color_distance(target_rgb, hex_to_rgb(x))
        )

        # Sort by brand, product, and distance to find the nearest color for each product
        filtered_df = filtered_df.sort_values(by=['brand', 'product', 'distance'])

        # Drop duplicates to keep only the nearest color for each brand and product
        filtered_df = filtered_df.drop_duplicates(subset=['brand', 'product'], keep='first')

        # Drop the distance column as it's no longer needed
        filtered_df = filtered_df.drop(columns=['distance'])
        #end of finding closest color

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
