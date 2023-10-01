import os
import hashlib
import sys
import time
from PIL import Image


if len(sys.argv) != 2:
    print("Usage: python generate_thumbnails.py <images_directory>")
    sys.exit(1)

time.sleep(3)

images_directory = sys.argv[1]
thumbnails_directory = os.path.expanduser('~/.ZED/thumbs')
thumbnail_size = (128, 128)

if not os.path.exists(thumbnails_directory):
    os.makedirs(thumbnails_directory)

for filename in os.listdir(images_directory):
    if filename.startswith('.'):
        continue

    file_path = os.path.join(images_directory, filename)

    try:
        with Image.open(file_path) as img:
            img.verify()
            time.sleep(0.5)
    except:
        continue

    hash = hashlib.sha1((file_path + filename).encode()).hexdigest()
    thumbnail_path = os.path.join(thumbnails_directory, hash + '.jpg')

    if os.path.exists(thumbnail_path):
        continue

    with Image.open(file_path) as img:
        try:
            aspect_ratio = img.width / img.height
            if aspect_ratio > 1:
                new_width = thumbnail_size[0]
                new_height = int(thumbnail_size[0] / aspect_ratio)
            else:
                new_width = int(thumbnail_size[1] * aspect_ratio)
                new_height = thumbnail_size[1]
            img.thumbnail((new_width, new_height))
            img = img.resize(thumbnail_size, resample=Image.LANCZOS)
            img.save(thumbnail_path, 'JPEG', quality=75)
        except:
            pass
