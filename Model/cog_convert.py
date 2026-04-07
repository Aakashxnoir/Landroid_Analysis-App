import sys
from rio_cogeo.cogeo import cog_translate
from rio_cogeo.profiles import cog_profiles

input_path = r"c:\Users\aakas\OneDrive\Desktop\VIT@VIT\src\ml_model\Orthomosaic_processed.tif"
output_path = r"c:\Users\aakas\OneDrive\Desktop\VIT@VIT\src\ml_model\Orthomosaic_cog.tif"

# Define profile for JPEG compression
# Profile includes tiling and internal overviews
dst_profile = cog_profiles.get("jpeg")
# Set BigTIFF for file over 4 GB or safe margin
dst_profile.update({
    "BIGTIFF": "YES", 
    "BLOCKXSIZE": 512, 
    "BLOCKYSIZE": 512
})

print(f"Starting conversion: {input_path}")
print(f"Target file: {output_path}")

try:
    cog_translate(
        input_path,
        output_path,
        dst_profile,
        config={
            "GDAL_NUM_THREADS": "ALL_CPUS",
            "GDAL_TIFF_INTERNAL_MASK": "TRUE",
        },
        quiet=False
    )
    print(f"\nSUCCESS: Cloud-Optimized GeoTIFF created at {output_path}")
except Exception as e:
    print(f"\nERROR during conversion: {str(e)}")
    sys.exit(1)
