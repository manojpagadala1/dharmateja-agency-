from pathlib import Path
import html

base = Path(r'c:\Users\MANOJ\Downloads\dharmateja-agencies-website\dharmateja-agencies\public\products')
base.mkdir(parents=True, exist_ok=True)
items = {
    'default-product': ('General', 'Product', '1 pack', '#dfeee7', '#135a3d', '#ffffff'),
    'tide-detergent': ('P&G', 'Tide Detergent', '1 kg', '#dfeaf8', '#1d4daa', '#ffffff'),
    'head-shoulders-shampoo': ('P&G', 'Head & Shoulders', '180 ml', '#f4ebff', '#6b4fc9', '#ffffff'),
    'maggi-noodles': ('Nestlé', 'Maggi Noodles', '70 g', '#fff0db', '#d67d00', '#ffffff'),
    'kitkat': ('Nestlé', 'KitKat', '38 g', '#fbe6e6', '#c92d39', '#ffffff'),
    'lays-classic-chips': ('Lay’s', 'Classic Chips', '52 g', '#fff5d9', '#f0a500', '#2c1d12'),
    'kurkure-masala-munch': ('Kurkure', 'Masala Munch', '75 g', '#fdf0de', '#d96a1b', '#ffffff'),
    'cadbury-dairy-milk': ('Cadbury', 'Dairy Milk', '40 g', '#f9e7ee', '#873a75', '#ffffff'),
    'cavins-milkshake': ('Cavin’s', 'Milkshake', '200 ml', '#eafaf3', '#0f9a7b', '#ffffff'),
    'medimix-soap': ('Medimix', 'Herbal Soap', '125 g', '#eaf6ee', '#257d4b', '#ffffff'),
    'paper-boat-aam-panna': ('Paper Boat', 'Aam Panna', '200 ml', '#fff1d9', '#ff9f1c', '#2d1f00'),
    'koyas-agarbathi': ('Koya’s', 'Agarbathi', 'Pack', '#f4f0e8', '#7d4d1f', '#ffffff'),
}
for filename, (brand, product_name, weight, bg, primary, text_color) in items.items():
    name = html.escape(product_name)
    brand_name = html.escape(brand)
    weight_label = html.escape(weight)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" role="img" aria-label="{name} {weight_label}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="320" height="260" fill="url(#g)"/>
  <rect x="26" y="26" width="268" height="208" rx="28" fill="#ffffff" opacity="0.88"/>
  <rect x="56" y="52" width="208" height="56" rx="18" fill="{primary}" opacity="0.96"/>
  <text x="160" y="89" text-anchor="middle" font-size="20" font-weight="700" font-family="Arial, sans-serif" fill="{text_color}">{brand_name}</text>
  <rect x="76" y="118" width="168" height="60" rx="18" fill="{bg}" stroke="{primary}" stroke-width="2"/>
  <text x="160" y="148" text-anchor="middle" font-size="23" font-weight="800" font-family="Arial, sans-serif" fill="{primary}">{name}</text>
  <text x="160" y="192" text-anchor="middle" font-size="24" font-weight="700" font-family="Arial, sans-serif" fill="#1f2d28">{weight_label}</text>
</svg>
'''
    (base / f'{filename}.svg').write_text(svg, encoding='utf-8')

print(f'Created {len(items)} SVG product images in {base}')
