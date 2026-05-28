import os
import random
import math
from PIL import Image, ImageDraw, ImageFilter

# Configuration
CLASSES = ['rice', 'wheat', 'maize', 'barley', 'millet', 'oats', 'chickpeas', 'corn', 'pulses']
IMAGE_SIZE = (128, 128)
SAMPLES_PER_CLASS = 100  # Reasonable size for fast training on local machine

def create_directory_structure(base_path):
    for cls in CLASSES:
        os.makedirs(os.path.join(base_path, 'dataset', cls), exist_ok=True)
    print("Dataset directory structure created.")

def draw_rice(draw, x, y, size):
    # Rice is long, slender, white/cream
    length = size * random.uniform(1.8, 2.5)
    width = size * random.uniform(0.6, 0.9)
    angle = random.uniform(0, 360)
    color = (random.randint(240, 255), random.randint(238, 250), random.randint(225, 240))
    draw_rotated_ellipse(draw, x, y, length, width, angle, color)

def draw_wheat(draw, x, y, size):
    # Wheat is golden-brown, oval, with a center crease
    length = size * random.uniform(1.4, 1.8)
    width = size * random.uniform(0.8, 1.1)
    angle = random.uniform(0, 360)
    color = (random.randint(210, 230), random.randint(160, 185), random.randint(90, 120))
    draw_rotated_ellipse(draw, x, y, length, width, angle, color)
    # Center crease
    crease_color = (random.randint(150, 175), random.randint(100, 125), random.randint(50, 75))
    draw_rotated_line(draw, x, y, length * 0.8, angle, crease_color, width=1)

def draw_maize(draw, x, y, size):
    # Maize/corn is yellow, wedge/rounded-square shaped
    angle = random.uniform(0, 360)
    color = (random.randint(245, 255), random.randint(190, 220), random.randint(0, 30))
    draw_rotated_polygon(draw, x, y, size * 1.2, size * 1.0, angle, color, corners=4)

def draw_barley(draw, x, y, size):
    # Barley is spindle-shaped, beige/light-brown, pointed ends
    length = size * random.uniform(1.6, 2.2)
    width = size * random.uniform(0.9, 1.2)
    angle = random.uniform(0, 360)
    color = (random.randint(220, 235), random.randint(190, 210), random.randint(140, 160))
    # Pointed ends can be simulated by layered ellipses or pointed lines
    draw_rotated_ellipse(draw, x, y, length, width, angle, color)
    # Small brown points at tips
    tip_color = (random.randint(120, 150), random.randint(90, 110), random.randint(60, 80))
    rad = math.radians(angle)
    tx1, ty1 = x + (length / 2) * math.cos(rad), y + (length / 2) * math.sin(rad)
    tx2, ty2 = x - (length / 2) * math.cos(rad), y - (length / 2) * math.sin(rad)
    draw.ellipse([tx1 - 1, ty1 - 1, tx1 + 1, ty1 + 1], fill=tip_color)
    draw.ellipse([tx2 - 1, ty2 - 1, tx2 + 1, ty2 + 1], fill=tip_color)

def draw_millet(draw, x, y, size):
    # Millet is small, round, yellow/beige
    color = (random.randint(235, 255), random.randint(200, 225), random.randint(110, 140))
    draw.ellipse([x - size * 0.7, y - size * 0.7, x + size * 0.7, y + size * 0.7], fill=color)

def draw_oats(draw, x, y, size):
    # Oats are flat, long, grayish-beige flakes
    length = size * random.uniform(2.0, 2.8)
    width = size * random.uniform(0.7, 1.0)
    angle = random.uniform(0, 360)
    color = (random.randint(200, 220), random.randint(185, 205), random.randint(165, 185))
    draw_rotated_ellipse(draw, x, y, length, width, angle, color)

def draw_chickpeas(draw, x, y, size):
    # Chickpeas are larger, bumpy, cream/beige spheres
    color = (random.randint(225, 245), random.randint(195, 215), random.randint(150, 175))
    # Draw a bumpy polygon or compound circles
    offset_x = random.uniform(-size * 0.15, size * 0.15)
    offset_y = random.uniform(-size * 0.15, size * 0.15)
    draw.ellipse([x - size * 1.1, y - size * 1.1, x + size * 1.1, y + size * 1.1], fill=color)
    draw.ellipse([x - size * 0.6 + offset_x, y - size * 0.6 + offset_y, x + size * 0.6 + offset_x, y + size * 0.6 + offset_y], fill=(color[0]-10, color[1]-10, color[2]-10))

def draw_corn(draw, x, y, size):
    # Similar to maize, golden yellow kernel
    angle = random.uniform(0, 360)
    color = (random.randint(250, 255), random.randint(200, 230), random.randint(20, 50))
    draw_rotated_polygon(draw, x, y, size * 1.3, size * 1.1, angle, color, corners=4)
    # Bright spot
    spot_color = (255, 255, 200)
    draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=spot_color)

def draw_pulses(draw, x, y, size):
    # Pulses (e.g. green split peas or red lentils) - round, split, bright green or orange
    is_green = random.choice([True, False])
    if is_green:
        color = (random.randint(90, 130), random.randint(160, 200), random.randint(70, 110))
    else:
        color = (random.randint(220, 245), random.randint(100, 130), random.randint(60, 90))
    
    # Split pea (half circle / flat edge)
    angle = random.uniform(0, 360)
    draw_rotated_pie(draw, x, y, size * 1.1, angle, color)

# Helper drawing functions
def draw_rotated_ellipse(draw, x, y, length, width, angle, color):
    # Create high-res image, draw shape, rotate, paste
    scale = 4
    temp_img = Image.new('RGBA', (int(length * 2 * scale), int(length * 2 * scale)), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp_img)
    cx, cy = length * scale, length * scale
    temp_draw.ellipse([cx - (length/2)*scale, cy - (width/2)*scale, cx + (length/2)*scale, cy + (width/2)*scale], fill=color)
    rotated = temp_img.rotate(angle, resample=Image.Resampling.BILINEAR)
    
    # Paste onto canvas
    # Find bounding box/offset
    px = int(x - length)
    py = int(y - length)
    return rotated, px, py

def draw_rotated_line(draw, x, y, length, angle, color, width=1):
    rad = math.radians(angle)
    dx = (length / 2) * math.cos(rad)
    dy = (length / 2) * math.sin(rad)
    draw.line([x - dx, y - dy, x + dx, y + dy], fill=color, width=width)

def draw_rotated_polygon(draw, x, y, length, width, angle, color, corners=4):
    scale = 4
    max_dim = int(max(length, width) * 2 * scale)
    temp_img = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp_img)
    cx, cy = max_dim // 2, max_dim // 2
    
    # Generate points
    points = []
    for i in range(corners):
        a = (2 * math.pi / corners) * i
        # Scale to make it a bit rectangular
        px = cx + (length/2) * scale * math.cos(a)
        py = cy + (width/2) * scale * math.sin(a)
        points.append((px, py))
    
    temp_draw.polygon(points, fill=color)
    rotated = temp_img.rotate(angle, resample=Image.Resampling.BILINEAR)
    
    px = int(x - max_dim / (2 * scale))
    py = int(y - max_dim / (2 * scale))
    return rotated, px, py

def draw_rotated_pie(draw, x, y, size, angle, color):
    scale = 4
    dim = int(size * 2 * scale)
    temp_img = Image.new('RGBA', (dim, dim), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp_img)
    cx, cy = dim // 2, dim // 2
    # Draw a chord / pie (half circle)
    temp_draw.pieslice([cx - size * scale, cy - size * scale, cx + size * scale, cy + size * scale], start=0, end=180, fill=color)
    rotated = temp_img.rotate(angle, resample=Image.Resampling.BILINEAR)
    
    px = int(x - size)
    py = int(y - size)
    return rotated, px, py

def generate_grain_image(cls, index, base_path):
    # Canvas with wood-like or linen background
    bg_r = random.randint(45, 65)
    bg_g = random.randint(35, 50)
    bg_b = random.randint(25, 40)
    
    img = Image.new('RGB', IMAGE_SIZE, (bg_r, bg_g, bg_b))
    draw = ImageDraw.Draw(img)
    
    # Draw background texture lines
    for _ in range(15):
        y = random.randint(0, IMAGE_SIZE[1])
        tc = (bg_r + random.randint(-5, 5), bg_g + random.randint(-5, 5), bg_b + random.randint(-5, 5))
        draw.line([0, y, IMAGE_SIZE[0], y + random.randint(-10, 10)], fill=tc, width=1)
        
    # Draw multiple grains scattered around
    # More grains in the center to look like a pile
    num_grains = random.randint(25, 40)
    grain_pil_images = []
    
    for _ in range(num_grains):
        # Cluster around center
        x = int(IMAGE_SIZE[0]/2 + random.gauss(0, 25))
        y = int(IMAGE_SIZE[1]/2 + random.gauss(0, 25))
        
        # Clamp to image boundaries with margins
        x = max(10, min(IMAGE_SIZE[0] - 10, x))
        y = max(10, min(IMAGE_SIZE[1] - 10, y))
        
        size = random.uniform(6, 12)
        
        # Drawing helper depending on class
        # Draw on separate transparent overlays to support overlay overlaps and rotations
        scale = 4
        # We will create individual image elements
        res = None
        if cls == 'rice':
            length = size * random.uniform(1.8, 2.5)
            width = size * random.uniform(0.6, 0.9)
            angle = random.uniform(0, 360)
            color = (random.randint(235, 255), random.randint(230, 250), random.randint(220, 240))
            res = draw_rotated_ellipse(draw, x, y, length, width, angle, color)
        elif cls == 'wheat':
            length = size * random.uniform(1.4, 1.8)
            width = size * random.uniform(0.8, 1.1)
            angle = random.uniform(0, 360)
            color = (random.randint(200, 225), random.randint(155, 180), random.randint(90, 120))
            res = draw_rotated_ellipse(draw, x, y, length, width, angle, color)
            # Add crease on the texture later or draw it directly
        elif cls == 'maize':
            length = size * random.uniform(1.1, 1.3)
            width = size * random.uniform(0.9, 1.1)
            angle = random.uniform(0, 360)
            color = (random.randint(240, 255), random.randint(180, 210), random.randint(0, 30))
            res = draw_rotated_polygon(draw, x, y, length, width, angle, color, corners=4)
        elif cls == 'barley':
            length = size * random.uniform(1.6, 2.2)
            width = size * random.uniform(0.9, 1.2)
            angle = random.uniform(0, 360)
            color = (random.randint(215, 235), random.randint(185, 205), random.randint(130, 155))
            res = draw_rotated_ellipse(draw, x, y, length, width, angle, color)
        elif cls == 'millet':
            length = size * random.uniform(0.9, 1.1)
            width = size * random.uniform(0.9, 1.1)
            angle = random.uniform(0, 360)
            color = (random.randint(230, 255), random.randint(195, 220), random.randint(100, 130))
            res = draw_rotated_ellipse(draw, x, y, length, width, angle, color)
        elif cls == 'oats':
            length = size * random.uniform(2.0, 2.7)
            width = size * random.uniform(0.7, 1.0)
            angle = random.uniform(0, 360)
            color = (random.randint(195, 215), random.randint(180, 200), random.randint(160, 180))
            res = draw_rotated_ellipse(draw, x, y, length, width, angle, color)
        elif cls == 'chickpeas':
            length = size * random.uniform(1.3, 1.6)
            width = size * random.uniform(1.2, 1.5)
            angle = random.uniform(0, 360)
            color = (random.randint(220, 240), random.randint(190, 210), random.randint(145, 170))
            res = draw_rotated_polygon(draw, x, y, length, width, angle, color, corners=5)
        elif cls == 'corn':
            length = size * random.uniform(1.2, 1.4)
            width = size * random.uniform(1.0, 1.2)
            angle = random.uniform(0, 360)
            color = (random.randint(245, 255), random.randint(195, 225), random.randint(20, 45))
            res = draw_rotated_polygon(draw, x, y, length, width, angle, color, corners=4)
        elif cls == 'pulses':
            length = size * random.uniform(1.0, 1.2)
            width = size * random.uniform(1.0, 1.2)
            angle = random.uniform(0, 360)
            is_green = random.choice([True, False])
            color = (random.randint(80, 120), random.randint(155, 190), random.randint(65, 100)) if is_green else (random.randint(215, 240), random.randint(95, 125), random.randint(55, 85))
            res = draw_rotated_pie(draw, x, y, length, angle, color)
            
        if res:
            grain_pil_images.append(res)
            
    # Sort from top-to-bottom so overlay looks correct
    grain_pil_images.sort(key=lambda item: item[2])
    
    # Paste overlays onto main image
    for r_img, px, py in grain_pil_images:
        img.paste(r_img, (px, py), r_img)
        
    # Apply a subtle blur & noise to make it realistic
    img = img.filter(ImageFilter.GaussianBlur(radius=0.3))
    
    # Save image
    save_path = os.path.join(base_path, 'dataset', cls, f'grain_{index:04d}.jpg')
    img.save(save_path, 'JPEG', quality=90)

def main():
    base_path = os.path.dirname(os.path.abspath(__file__))
    create_directory_structure(base_path)
    
    print(f"Generating {SAMPLES_PER_CLASS} images per class for {len(CLASSES)} classes. Total = {SAMPLES_PER_CLASS * len(CLASSES)} images.")
    for i, cls in enumerate(CLASSES):
        print(f"Generating class: {cls} ({i+1}/{len(CLASSES)})")
        for idx in range(SAMPLES_PER_CLASS):
            generate_grain_image(cls, idx, base_path)
            
    print("Dataset generation completed successfully.")

if __name__ == '__main__':
    main()
