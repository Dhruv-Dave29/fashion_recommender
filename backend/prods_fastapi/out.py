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

# Load CSV data
df = pd.read_csv("hm_products.csv")

# Fill NaN values with empty strings to avoid JSON errors
df = df.fillna("")

@app.get("/")
def home():
    return {"message": "Welcome to H&M Product API!"}

@app.get("/products")
def get_products(name: str = Query(None), product_type: str = Query(None)):
    """Fetch all products or filter by name/product_type."""
    filtered_df = df.copy()

    if name:
        filtered_df = filtered_df[filtered_df["Product Name"].str.contains(name, case=False, na=False)]
    
    if product_type:
        filtered_df = filtered_df[filtered_df["Product Type"].str.contains(product_type, case=False, na=False)]

    # Convert DataFrame to JSON-friendly format
    products_list = filtered_df.to_dict(orient="records")

    return json.loads(json.dumps(products_list))  # Ensures no NaN values

@app.post("/api/recommendations")  # Changed from get_products to match frontend
async def get_recommendations(request: dict):
    """Fetch products based on skin tone and type."""
    filtered_df = df.copy()
    
    recommendation_type = request.get("type", "makeup")
    
    if recommendation_type == "makeup":
        filtered_df = filtered_df[
            filtered_df["Product Type"].str.contains("makeup|cosmetic|lipstick|foundation", 
            case=False, 
            na=False)
        ]
    else:  # outfit
        filtered_df = filtered_df[
            filtered_df["Product Type"].str.contains("dress|top|shirt|pants", 
            case=False, 
            na=False)
        ]
    
    # Take random 15 products
    if len(filtered_df) > 15:
        filtered_df = filtered_df.sample(n=15)
    
    # Convert DataFrame to JSON-friendly format
    products_list = filtered_df.to_dict(orient="records")
    
    return {"products": products_list}

