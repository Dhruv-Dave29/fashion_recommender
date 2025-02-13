from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

# Load the cleaned CSV file into a pandas DataFrame
df = pd.read_csv("ulta_sephora_with_mst_index.csv")

# Load the H&M products CSV file
hm_df = pd.read_csv("hm_products.csv")

# Initialize the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the CSV API!"}

# Define an endpoint to get paginated and filtered data
@app.get("/data/")
def get_data(
    mst: str = Query(None, description="Filter by 'mst' column"),
    page: int = Query(1, description="Page number", ge=1),
    limit: int = Query(20, description="Items per page", le=20),
):
    # Filter data by 'mst' column if provided
    filtered_df = df
    if mst:
        filtered_df = df[df["mst"] == mst]

    # Calculate pagination
    
    total_items = len(filtered_df)
    total_pages = (total_items + limit - 1) // limit
    start = (page - 1) * limit
    end = start + limit

    # Get paginated data
    paginated_data = filtered_df.iloc[start:end].to_dict(orient="records")

    return {
        "data": paginated_data,
        "page": page,
        "limit": limit,
        "total_items": total_items,
        "total_pages": total_pages,
    }

@app.get("/api/random-outfits")
async def get_random_outfits(limit: int = Query(default=8)):
    # Randomly sample products from the H&M dataset
    random_products = hm_df.sample(n=min(limit, len(hm_df))).to_dict(orient="records")
    
    return {
        "data": random_products,
        "total_items": len(random_products)
    }