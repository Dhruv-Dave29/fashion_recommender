from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run
import os
import tensorflow as tf
from sklearn.cluster import KMeans
import numpy as np
import cv2
from webcolors import hex_to_rgb, rgb_to_hex
from scipy.spatial import KDTree
from collections import Counter



app = FastAPI()

origins = ["*"]
methods = ["*"]
headers = ["*"]

app.add_middleware(
    CORSMiddleware, 
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = methods,
    allow_headers = headers    
)

model = tf.keras.models.load_model("model.h5")

def face_skin_extract(pred,image_x):
    output = np.zeros_like(image_x, dtype=np.uint8)
    # mask = (pred == 1) | (pred == 6)
    mask = (pred==1)
    output[mask] = image_x[mask]
    return output

classes = [
    "background", "skin", "left eyebrow", "right eyebrow",
    "left eye", "right eye", "nose", "upper lip", "inner mouth",
    "lower lip", "hair"
]

################################################################################
#READING FACE SKIN AFTER EXTRACTING FROM UNETMODEL

def extract_dom_color_kmeans(img):

    # Mask to exclude black pixels
    mask = ~np.all(img == [0, 0, 0], axis=-1)

    # Extract non-black pixels
    non_black_pixels = img[mask]

    # Apply KMeans clustering on non-black pixels
    k_cluster = KMeans(n_clusters=3, n_init="auto")
    k_cluster.fit(non_black_pixels)




    width = 300
    palette = np.zeros((50, width, 3), dtype=np.uint8)
    
    # Count the pixels per cluster
    n_pixels = len(k_cluster.labels_)
    counter = Counter(k_cluster.labels_)
    
    # Calculate percentages for each cluster
    perc = {i: np.round(counter[i] / n_pixels, 2) for i in counter}
    perc = dict(sorted(perc.items()))

    cluster_centers = k_cluster.cluster_centers_
    
    # Logging purposes
    print("Cluster Percentages:", perc)
    print("Cluster Centers (RGB):", cluster_centers)

    val = list(perc.values())
    val.sort()
    res = val[-1]
    print(res)
    sec_high_val = list(perc.keys())[list(perc.values()).index(res)]
    rgb_list = cluster_centers[sec_high_val]
    # Create the palette
    step = 0
    for idx, center in enumerate(k_cluster.cluster_centers_):
        # Fill the palette with the cluster's color
        width_step = int(perc[idx] * width + 1)
        palette[:, step:step + width_step, :] = center
        #take palette from here for the skin graph
        step += width_step
    
    return rgb_list

# Generate the palette
# rgb_list = palette_perc(clt)

##############################################################################

#after kmeans, finding dominant rgb tuple START
def closest_tone_match(rgb_tuple):
    skin_tones = {'Monk 10': '#292420', 'Monk 9': '#3a312a', 'Monk 8':'#604134', 'Monk 7':'#825c43', 'Monk 6':'#a07e56', 'Monk 5':'#d7bd96', 'Monk 4':'#eadaba', 'Monk 3':'#f7ead0', 'Monk 2':'#f3e7db', 'Monk 1':'#f6ede4'}

    rgb_values = []
    names = []
    for monk in skin_tones:
        names.append(monk)
        rgb_values.append(hex_to_rgb(skin_tones[monk]))
    
    kdt_db = KDTree(rgb_values)
    distance, index = kdt_db.query(rgb_tuple)
    monk_hex = skin_tones[names[index]]
    derived_hex = rgb_to_hex((int(rgb_tuple[0]), int(rgb_tuple[1]), int(rgb_tuple[2])))
    return names[index],monk_hex,derived_hex 


#dominant tuple END


@app.get("/")
async def root():
    return {"message": "Welcome to the Food Vision API!"}

@app.post("/upload_image")
async def process_image(file: UploadFile = File(...)):

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    

    image_x = cv2.resize(image, (512, 512))
    image_norm = image_x / 255.0
    image_norm = np.expand_dims(image_norm, axis=0).astype(np.float32)
    

    pred = model.predict(image_norm)[0]
    pred = np.argmax(pred, axis=-1).astype(np.int32)
    

    face_skin = face_skin_extract(pred, image_x)
    dominant_color_rgb= extract_dom_color_kmeans(face_skin) #gives dominant rgb tuple
    monk_tone,monk_hex,derived_hex = closest_tone_match((dominant_color_rgb[0],dominant_color_rgb[1],dominant_color_rgb[2])) #gives monk skin tone

    
    return {
        "derived_hex_code": derived_hex,
        "monk_hex": monk_hex,
        "monk_skin_tone": monk_tone,
        "dominant_rgb": dominant_color_rgb.tolist()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)