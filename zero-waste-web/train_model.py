import os
import json
from pathlib import Path
from PIL import Image
import numpy as np

# This script analyzes the Kaggle dataset and generates
# a calibrated scoring prompt for the Claude AI

dataset_path = Path("kaggle_dataset/Dataset")

def analyze_image(img_path):
    try:
        img = Image.open(img_path).convert('RGB')
        img = img.resize((100, 100))
        arr = np.array(img)
        return {
            'mean_r': float(arr[:,:,0].mean()),
            'mean_g': float(arr[:,:,1].mean()),
            'mean_b': float(arr[:,:,2].mean()),
            'std': float(arr.std())
        }
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return None

fresh_profiles = []
rotten_profiles = []
categories = {}

# Iterate through Fresh and Rotten folders
for folder in dataset_path.iterdir():
    if folder.is_dir():
        status = folder.name.lower() # 'fresh' or 'rotten'
        
        # In this dataset, there might be subfolders for specific fruits
        # Let's count all images recursively
        images = list(folder.rglob("*.jpg")) + list(folder.rglob("*.png")) + list(folder.rglob("*.jpeg"))
        categories[folder.name] = len(images)
        print(f"Category: {folder.name} — {len(images)} images")
        
        # Sample images for profile analysis
        sample_size = min(50, len(images))
        sampled_images = np.random.choice(images, sample_size, replace=False)
        
        for img_path in sampled_images:
            profile = analyze_image(img_path)
            if profile:
                if status == 'fresh':
                    fresh_profiles.append(profile)
                else:
                    rotten_profiles.append(profile)

if fresh_profiles and rotten_profiles:
    avg_fresh_g = np.mean([p['mean_g'] for p in fresh_profiles])
    avg_rotten_g = np.mean([p['mean_g'] for p in rotten_profiles])
    avg_fresh_std = np.mean([p['std'] for p in fresh_profiles])
    avg_rotten_std = np.mean([p['std'] for p in rotten_profiles])

    print(f"\nFresh avg green channel: {avg_fresh_g:.1f}")
    print(f"Rotten avg green channel: {avg_rotten_g:.1f}")
    print(f"Fresh avg std deviation: {avg_fresh_std:.1f}")
    print(f"Rotten avg std deviation: {avg_rotten_std:.1f}")

    # Save calibration data
    calibration = {
        'fresh_mean_green': float(avg_fresh_g),
        'rotten_mean_green': float(avg_rotten_g),
        'fresh_std': float(avg_fresh_std),
        'rotten_std': float(avg_rotten_std),
        'categories': categories,
        'recommendation': "STRICT_SCORING_REQUIRED"
    }
    with open('model_calibration.json', 'w') as f:
        json.dump(calibration, f, indent=2)
    print("\nCalibration saved to model_calibration.json")
else:
    print("\nError: Could not collect enough image profiles for calibration.")
