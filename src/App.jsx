import React, { useEffect, useMemo, useState } from 'react';
import { Boxes, Store, ClipboardList, LogOut, PackagePlus, Search, MapPin, MessageCircle, IndianRupee, Package, CheckCircle2, Clock3, Truck, AlertTriangle } from 'lucide-react';

const LOCATIONS = ['Satyavedu','Nagalapuram','Pichatoor','Tada','Varadayyapalem','B.N. Kandriga','Sri City','Other'];
const INITIAL_PRODUCTS = [
  {id:1,name:'Tide Detergent',brand:'P&G',weight:'1 kg',price:125,stock:120,category:'Home care',image:'/products/tide-detergent.svg'},
  {id:2,name:'Head & Shoulders Shampoo',brand:'P&G',weight:'180 ml',price:155,stock:72,category:'Personal care',image:'/products/head-shoulders-shampoo.svg'},
  {id:3,name:'Maggi Noodles',brand:'Nestlé',weight:'70 g',price:14,stock:500,category:'Food',image:'/products/maggi-noodles.svg'},
  {id:4,name:'KitKat',brand:'Nestlé',weight:'38 g',price:20,stock:240,category:'Chocolate',image:'/products/kitkat.svg'},
  {id:5,name:'Lay’s Classic Chips',brand:'Lay’s',weight:'52 g',price:20,stock:300,category:'Snacks',image:'/products/lays-classic-chips.svg'},
  {id:6,name:'Kurkure Masala Munch',brand:'Kurkure',weight:'75 g',price:20,stock:260,category:'Snacks',image:'/products/kurkure-masala-munch.svg'},
  {id:7,name:'Cadbury Dairy Milk',brand:'Cadbury',weight:'40 g',price:30,stock:180,category:'Chocolate',image:'/products/cadbury-dairy-milk.svg'},
  {id:8,name:'Cavin’s Milkshake',brand:'Cavin’s',weight:'200 ml',price:35,stock:96,category:'Beverages',image:'/products/cavins-milkshake.svg'},
  {id:9,name:'Medimix Soap',brand:'Medimix',weight:'125 g',price:38,stock:140,category:'Personal care',image:'/products/medimix-soap.svg'},
  {id:10,name:'Paper Boat Aam Panna',brand:'Paper Boat',weight:'200 ml',price:30,stock:110,category:'Beverages',image:'/products/paper-boat-aam-panna.svg'},
  {id:11,name:'Koya’s Agarbathi',brand:'Koya’s',weight:'Pack',price:45,stock:85,category:'Pooja essentials',image:'/products/koyas-agarbathi.svg'}
];
const DEMO_ORDERS = [
  {id:'DEMO-1001',shop:'Sample Shop A',items:'Maggi Noodles × 10, KitKat × 5',total:240,status:'Processing'},
  {id:'DEMO-1002',shop:'Sample Shop B',items:'Tide Detergent × 4, Medimix Soap × 8',total:804,status:'Dispatched'},
  {id:'DEMO-1003',shop:'Sample Shop C',items:'Lay’s Classic Chips × 12, Kurkure Masala Munch × 12',total:480,status:'Delivered'}
];
const DEMO_ROUTE_HISTORY = [
  {id:'H-01',route:'Satyavedu → Tada → Sri City',dateOffset:-7,start:'8:15 AM',end:'1:05 PM',duration:'4 hr 50 min',stops:12},
  {id:'H-02',route:'Nagalapuram → Pichatoor',dateOffset:-5,start:'8:40 AM',end:'12:10 PM',duration:'3 hr 30 min',stops:9},
  {id:'H-03',route:'Varadayyapalem → B.N. Kandriga → Satyavedu',dateOffset:-3,start:'9:00 AM',end:'2:20 PM',duration:'5 hr 20 min',stops:14}
];
const WEEKLY_ROUTE_PLAN = {
  1:{route:'Satyavedu → Tada → Sri City',start:'8:00 AM',end:'1:00 PM',duration:'5 hr'},
  2:{route:'Nagalapuram → Pichatoor',start:'8:30 AM',end:'12:30 PM',duration:'4 hr'},
  3:{route:'Varadayyapalem → B.N. Kandriga',start:'8:00 AM',end:'12:00 PM',duration:'4 hr'},
  4:{route:'Tada → Sri City → Satyavedu',start:'8:30 AM',end:'1:30 PM',duration:'5 hr'},
  5:{route:'Pichatoor → Nagalapuram → B.N. Kandriga',start:'8:00 AM',end:'1:00 PM',duration:'5 hr'},
  6:{route:'Satyavedu → Varadayyapalem',start:'9:00 AM',end:'12:00 PM',duration:'3 hr'}
};
const fmt = n => '₹' + Number(n || 0).toLocaleString('en-IN');
function dateLabel(offset) { const date=new Date(); date.setDate(date.getDate()+offset); return date.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}); }
function getUpcomingRoutes() {
  const today=new Date().getDay();
  const daysUntilSaturday=today===0?0:6-today;
  return Array.from({length:daysUntilSaturday},(_,index)=>index+1)
    .map(offset=>({date:dateLabel(offset),...WEEKLY_ROUTE_PLAN[(today+offset)%7]}))
    .filter(route=>route.route);
}
function getStore(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }

export default function App() {
  const [products,setProducts] = useState(()=>getStore('dta_products',INITIAL_PRODUCTS));
  const [orders,setOrders] = useState(()=>getStore('dta_orders',[]));
  const [session,setSession] = useState(()=>getStore('dta_session',null));
  const [showPublicStock,setShowPublicStock] = useState(false);
  const [showPublicOrders,setShowPublicOrders] = useState(false);
  const [showPublicRoutes,setShowPublicRoutes] = useState(false);
  const [loginId,setLoginId] = useState('DHARMATEJA');
  const [password,setPassword] = useState('');
  const [role,setRole] = useState('shop');
  const [error,setError] = useState('');
  const [page,setPage] = useState('dashboard');
  const [query,setQuery] = useState('');
  const [location,setLocation] = useState('Satyavedu');
  const [shopName,setShopName] = useState('');
  const [shopPhone,setShopPhone] = useState('');
  const [cart,setCart] = useState({});
  const [notice,setNotice] = useState('');
  const [editing,setEditing] = useState(null);
  const [productForm,setProductForm] = useState({name:'',brand:'',weight:'',price:'',stock:'',category:'Other'});
  const [ownerPhone,setOwnerPhone] = useState(()=>getStore('dta_owner_phone',''));
  const [notificationNumber,setNotificationNumber] = useState(()=>getStore('dta_sms_phone',''));

  useEffect(()=>localStorage.setItem('dta_products',JSON.stringify(products)),[products]);
  useEffect(()=>localStorage.setItem('dta_orders',JSON.stringify(orders)),[orders]);
  useEffect(()=>localStorage.setItem('dta_session',JSON.stringify(session)),[session]);
  useEffect(()=>localStorage.setItem('dta_owner_phone',JSON.stringify(ownerPhone)),[ownerPhone]);
  useEffect(()=>localStorage.setItem('dta_sms_phone',JSON.stringify(notificationNumber)),[notificationNumber]);

  const isOwner = session?.role === 'owner';
  const filtered = useMemo(()=>products.filter(p => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase())),[products,query]);
  const totalStock = products.reduce((a,p)=>a+Number(p.stock||0),0);
  const pending = orders.filter(o=>o.status==='Pending');
  const totalDue = orders.reduce((a,o)=>a+Number(o.total||0),0);

  function login(e) {
    e.preventDefault(); setError('');
    if (loginId.trim().toUpperCase() !== 'DHARMATEJA') { setError('Please enter the supplied user ID: DHARMATEJA'); return; }
    if (role==='owner' && password==='MAGGIE@123') { setSession({role:'owner',id:'DHARMATEJA'}); setPage('dashboard'); }
    else if (role==='shop' && password==='123') { setSession({role:'shop',id:'DHARMATEJA'}); setPage('catalog'); }
    else setError('Incorrect user ID or password for the selected login.');
  }
  function logout(){setSession(null);setPassword('');setPage('dashboard');}
  function saveProduct(e) {
    e.preventDefault();
    const p={...productForm,id:editing ?? Date.now(),price:Number(productForm.price),stock:Number(productForm.stock)};
    if(!p.name.trim() || !p.brand.trim() || !p.weight.trim() || p.price<0 || p.stock<0){setNotice('Please complete all product fields with valid numbers.');return;}
    setProducts(old=>editing ? old.map(x=>x.id===editing?p:x) : [p,...old]);
    setEditing(null);setProductForm({name:'',brand:'',weight:'',price:'',stock:'',category:'Other'});setNotice('Product saved successfully.');
  }
  function editProduct(p){setEditing(p.id);setProductForm({name:p.name,brand:p.brand,weight:p.weight,price:String(p.price),stock:String(p.stock),category:p.category||'Other'});setPage('products');}
  function removeProduct(id){if(confirm('Delete this product from the catalogue?'))setProducts(old=>old.filter(p=>p.id!==id));}
  function setQty(id,value){setCart(old=>({...old,[id]:Math.max(0,Math.min(999,Number(value)||0))}));}
  function placeOrder(e){
    e.preventDefault();
    if(!shopName.trim()){setNotice('Please enter your shop name.');return;}
    const lines=products.filter(p=>Number(cart[p.id]||0)>0).map(p=>({...p,quantity:Number(cart[p.id]),lineTotal:Number(cart[p.id])*Number(p.price)}));
    if(!lines.length){setNotice('Choose at least one product quantity before placing an order.');return;}
    const unavailable=lines.find(x=>x.quantity>x.stock);
    if(unavailable){setNotice(`${unavailable.name}: only ${unavailable.stock} units are currently listed as available. Please reduce the quantity.`);return;}
    const order={id:'DTA-'+Date.now().toString().slice(-7),shopName:shopName.trim(),shopPhone:shopPhone.trim(),location,createdAt:new Date().toLocaleString('en-IN'),items:lines,total:lines.reduce((a,x)=>a+x.lineTotal,0),status:'Pending'};
    setOrders(old=>[order,...old]);
    setProducts(old=>old.map(p=>{const line=lines.find(x=>x.id===p.id);return line?{...p,stock:p.stock-line.quantity}:p;}));
    setCart({});setNotice(`Order ${order.id} placed. It is now visible in the owner dashboard.`);
    const msg=`New order — Dharmateja Agencies%0AOrder: ${order.id}%0AShop: ${encodeURIComponent(order.shopName)}%0ALocation: ${encodeURIComponent(order.location)}%0AItems: ${encodeURIComponent(lines.map(x=>`${x.name} (${x.weight}) x ${x.quantity}`).join(', '))}%0ATotal: ${encodeURIComponent(fmt(order.total))}`;
    if(ownerPhone.replace(/\D/g,'').length>=10) window.open(`https://wa.me/${ownerPhone.replace(/\D/g,'')}?text=${msg}`,'_blank','noopener,noreferrer');
  }
  function updateStatus(id,status){setOrders(old=>old.map(o=>o.id===id?{...o,status}:o));}
  const nav = isOwner ? [
    ['dashboard','Dashboard',Boxes],['products','Products & Stock',Package],['orders','Shop Orders',ClipboardList],['settings','Notifications',MessageCircle]
  ] : [['catalog','Order Products',Store],['myorders','My Orders',ClipboardList]];

  if(!session && showPublicStock) return <main className="public-stock-shell">
    <header className="public-stock-header"><div className="brand-mark small"><Boxes size={22}/></div><div><span className="eyebrow">DHARMATEJA AGENCIES</span><h1>Products in godown</h1><p>Current available quantity for each product.</p></div><button className="secondary" onClick={()=>setShowPublicStock(false)}>← Back to login</button></header>
    <section className="public-stock-summary"><Package size={20}/><strong>{products.length} products</strong><span>{totalStock.toLocaleString('en-IN')} total units in godown</span></section>
    <div className="public-stock-grid">{products.map(product=><article className="public-stock-card" key={product.id}>
      <ProductImage product={product} size={48} borderRadius={12}/>
      <div className="public-stock-details"><strong>{product.name}</strong><span>{product.brand} · {product.weight}</span></div>
      <div className="public-stock-quantity"><strong>{Number(product.stock || 0).toLocaleString('en-IN')}</strong><span>units</span></div>
    </article>)}</div>
  </main>;

  if(!session && showPublicOrders) return <main className="public-stock-shell">
    <header className="public-stock-header"><div className="brand-mark small"><ClipboardList size={22}/></div><div><span className="eyebrow">DHARMATEJA AGENCIES</span><h1>Shop orders</h1><p>Example orders to show how order tracking works.</p></div><button className="secondary" onClick={()=>setShowPublicOrders(false)}>← Back to login</button></header>
    <section className="demo-orders-note"><AlertTriangle size={18}/><span>These are sample orders only. No real shop or customer information is shown.</span></section>
    <div className="public-orders-list">{DEMO_ORDERS.map(order=><article className="public-order-card" key={order.id}>
      <div className="public-order-heading"><div><span className="eyebrow">SAMPLE ORDER</span><h2>{order.id}</h2></div><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></div>
      <div className="public-order-shop"><Store size={16}/><strong>{order.shop}</strong></div>
      <p>{order.items}</p>
      <div className="public-order-total"><span>Example total</span><strong>{fmt(order.total)}</strong></div>
    </article>)}</div>
  </main>;

  if(!session && showPublicRoutes) return <main className="public-stock-shell">
    <header className="public-stock-header"><div className="brand-mark small"><Truck size={22}/></div><div><span className="eyebrow">DHARMATEJA AGENCIES</span><h1>Delivery tracking</h1><p>Example route history and this week’s planned delivery runs.</p></div><button className="secondary" onClick={()=>setShowPublicRoutes(false)}>← Back to login</button></header>
    <section className="demo-orders-note"><AlertTriangle size={18}/><span>Sample routes and timings for demonstration only. Replace these examples with your actual delivery records and schedule.</span></section>
    <section className="route-section"><div className="route-section-heading"><div><h2>Completed route history</h2><p>Example start time, finish time, and total time on each route.</p></div><span className="route-sample-tag">SAMPLE HISTORY</span></div>
      <div className="route-history-list">{DEMO_ROUTE_HISTORY.map(item=><article className="route-history-card" key={item.id}>
        <div className="route-history-date"><span>{dateLabel(item.dateOffset)}</span><strong>Completed</strong></div>
        <div className="route-history-main"><div className="route-name"><MapPin size={17}/><strong>{item.route}</strong></div><div className="route-time-grid"><div><span>Started</span><strong>{item.start}</strong></div><div><span>Finished</span><strong>{item.end}</strong></div><div><span>Time on route</span><strong>{item.duration}</strong></div><div><span>Delivery stops</span><strong>{item.stops}</strong></div></div></div>
      </article>)}</div>
    </section>
    <section className="route-section"><div className="route-section-heading"><div><h2>Upcoming routes this week</h2><p>Example routes planned for the remaining days of this week.</p></div><span className="route-sample-tag">WEEKLY PLAN</span></div>
      <div className="upcoming-route-list">{getUpcomingRoutes().map((item,index)=><article className="upcoming-route-card" key={`${item.date}-${item.route}`}>
        <div className="upcoming-route-date"><span>ROUTE {String(index+1).padStart(2,'0')}</span><strong>{item.date}</strong></div><div className="route-name"><MapPin size={17}/><strong>{item.route}</strong></div><div className="upcoming-route-time"><Clock3 size={15}/><span>{item.start} – {item.end}</span><strong>{item.duration}</strong></div>
      </article>)}{!getUpcomingRoutes().length&&<p className="empty-card">No sample routes remain for this week. Check back next week.</p>}</div>
    </section>
  </main>;

  if(!session) return <main className="login-shell">
    <div className="login-art"><div className="brand-mark"><Boxes size={28}/></div><span className="eyebrow">DISTRIBUTION • STOCK • ORDERS</span><h1>DHARMATEJA<br/><em>AGENCIES</em></h1><p>One simple place to manage products, shop orders and godown stock across your service areas.</p><div className="login-pills"><button type="button" className="login-pill" onClick={()=>setShowPublicStock(true)}><Package size={16}/> Product stock</button><button type="button" className="login-pill" onClick={()=>setShowPublicOrders(true)}><Store size={16}/> Shop orders</button><button type="button" className="login-pill" onClick={()=>setShowPublicRoutes(true)}><Truck size={16}/> Delivery tracking</button></div></div>
    <div className="login-panel"><div className="login-form-wrap"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to continue</h2><p className="muted">Choose the login type that matches your role.</p>
      <div className="role-switch"><button className={role==='owner'?'selected':''} onClick={()=>{setRole('owner');setError('')}}><Boxes size={17}/> Owner login</button><button className={role==='shop'?'selected':''} onClick={()=>{setRole('shop');setError('')}}><Store size={17}/> Shop login</button></div>
      <form onSubmit={login} className="form-stack"><label>User ID<input value={loginId} onChange={e=>setLoginId(e.target.value)} autoComplete="username" required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required/></label>
        {error&&<div className="error">{error}</div>}<button className="primary full" type="submit">Login as {role==='owner'?'Owner':'Shop'} <span>→</span></button></form>
      <div className="demo-note"><AlertTriangle size={16}/><span>Prototype login credentials are configured as requested. Before public deployment, replace these with secure server-side authentication.</span></div>
    </div></div>
  </main>;

  return <div className="app-shell">
    <aside className="sidebar"><div className="side-brand"><div className="brand-mark small"><Boxes size={22}/></div><div><strong>DHARMATEJA</strong><span>AGENCIES</span></div></div><div className="side-label">WORKSPACE</div><nav>{nav.map(([key,label,Icon])=><button key={key} className={page===key?'nav-active':''} onClick={()=>{setPage(key);setNotice('')}}><Icon size={18}/>{label}{key==='orders'&&pending.length>0&&<span className="nav-count">{pending.length}</span>}</button>)}</nav><div className="side-bottom"><div className="user-mini"><div className="avatar">{isOwner?'O':'S'}</div><div><strong>{isOwner?'Agency Owner':'Shop Account'}</strong><span>{session.id}</span></div></div><button className="logout" onClick={logout}><LogOut size={17}/> Sign out</button></div></aside>
    <main className="main-area"><header className="topbar"><div><span className="eyebrow">{isOwner?'OWNER WORKSPACE':'SHOP PORTAL'}</span><h2>{page==='dashboard'?'Business overview':page==='products'?'Products & stock':page==='orders'?'Shop orders':page==='settings'?'Notification settings':page==='catalog'?'Browse products':'My orders'}</h2></div><div className="topbar-right"><span className="live-dot"></span><span>Local workspace</span><div className="avatar">{isOwner?'O':'S'}</div></div></header>
      {notice&&<div className="notice"><CheckCircle2 size={18}/>{notice}<button onClick={()=>setNotice('')}>×</button></div>}
      {page==='dashboard'&&isOwner&&<><section className="welcome-card"><div><span className="eyebrow light">DHARMATEJA AGENCIES</span><h1>Good business starts<br/>with a clear overview.</h1><p>Monitor godown stock, incoming shop orders and daily distribution.</p></div><div className="welcome-icon"><Boxes size={66}/></div></section>
        <section className="stats-grid"><Stat icon={IndianRupee} label="Order value" value={fmt(totalDue)} sub="Across all recorded orders"/><Stat icon={ClipboardList} label="Pending orders" value={pending.length} sub="Waiting for confirmation"/><Stat icon={Package} label="Product types" value={products.length} sub={`${totalStock.toLocaleString('en-IN')} units in stock`}/><Stat icon={Store} label="Service locations" value={LOCATIONS.length-1} sub="Across your distribution area"/></section>
        <div className="section-heading"><div><h3>Latest shop orders</h3><p>Orders placed by shops appear here automatically on this browser.</p></div><button className="text-button" onClick={()=>setPage('orders')}>View all orders →</button></div>
        <OrderTable orders={orders.slice(0,5)} updateStatus={updateStatus}/>
        <div className="section-heading"><div><h3>Stock watch</h3><p>Products that may need restocking.</p></div><button className="text-button" onClick={()=>setPage('products')}>Manage stock →</button></div><div className="stock-list">{products.filter(p=>p.stock<50).slice(0,5).map(p=><div className="stock-row" key={p.id}><ProductImage product={p} size={38} borderRadius={10}/><div className="stock-info"><strong>{p.name}</strong><span>{p.brand} · {p.weight}</span></div><span className="stock-qty low">{p.stock} left</span></div>)}{!products.some(p=>p.stock<50)&&<p className="empty-inline">No low-stock items at the moment.</p>}</div>
      </>}
      {page==='products'&&isOwner&&<><div className="section-heading"><div><h3>Godown inventory</h3><p>Add products or update selling price and available quantity.</p></div><button className="primary" onClick={()=>{setEditing(null);setProductForm({name:'',brand:'',weight:'',price:'',stock:'',category:'Other'});document.getElementById('product-form')?.scrollIntoView({behavior:'smooth'});}}><PackagePlus size={17}/> Add product</button></div>
        <div className="toolbar"><div className="searchbox"><Search size={17}/><input placeholder="Search products or brands..." value={query} onChange={e=>setQuery(e.target.value)}/></div><span className="muted small-text">{filtered.length} products</span></div>
        <div className="table-card"><table><thead><tr><th>Product</th><th>Pack size</th><th>Price / unit</th><th>Godown stock</th><th>Actions</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><div className="table-product"><ProductImage product={p} size={38} borderRadius={10}/><div><strong>{p.name}</strong><span>{p.brand} · {p.category}</span></div></div></td><td>{p.weight}</td><td className="money">{fmt(p.price)}</td><td><span className={`stock-qty ${p.stock<50?'low':''}`}>{p.stock} units</span></td><td><div className="action-row"><button className="small-button" onClick={()=>editProduct(p)}>Edit</button><button className="small-button danger-button" onClick={()=>removeProduct(p.id)}>Delete</button></div></td></tr>)}</tbody></table>{!filtered.length&&<p className="empty-inline">No matching products.</p>}</div>
        <div className="section-heading" id="product-form"><div><h3>{editing?'Update product':'Add a product'}</h3><p>Stock quantities represent available godown units for the listed pack size.</p></div></div>
        <form className="editor-card" onSubmit={saveProduct}><div className="field-grid"><label>Product name<input value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} required placeholder="e.g. Dairy Milk"/></label><label>Brand / company<input value={productForm.brand} onChange={e=>setProductForm({...productForm,brand:e.target.value})} required placeholder="e.g. Cadbury"/></label><label>Pack size / weight<input value={productForm.weight} onChange={e=>setProductForm({...productForm,weight:e.target.value})} required placeholder="e.g. 40 g"/></label><label>Category<select value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}>{['Food','Snacks','Chocolate','Beverages','Home care','Personal care','Pooja essentials','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label>Price per unit (₹)<input type="number" min="0" step="0.01" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} required/></label><label>Available stock (units)<input type="number" min="0" step="1" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})} required/></label></div><div className="form-actions"><button type="button" className="secondary" onClick={()=>{setEditing(null);setProductForm({name:'',brand:'',weight:'',price:'',stock:'',category:'Other'});}}>Clear</button><button className="primary" type="submit">Save product</button></div></form>
      </>}
      {page==='orders'&&isOwner&&<><div className="section-heading"><div><h3>All shop orders</h3><p>Review orders, update their status and prepare deliveries.</p></div><div className="pill-stat"><Clock3 size={16}/>{pending.length} pending</div></div><OrderTable orders={orders} updateStatus={updateStatus} detailed/></>}
      {page==='settings'&&isOwner&&<div className="settings-card"><div className="settings-intro"><div className="settings-icon"><MessageCircle size={25}/></div><div><h3>Order notifications</h3><p>Set the agency phone number to open WhatsApp with each new order pre-filled.</p></div></div><label>Owner WhatsApp number<input value={ownerPhone} onChange={e=>setOwnerPhone(e.target.value)} placeholder="e.g. 919876543210"/></label><p className="help-text">Enter country code + phone number without spaces. Example: 91 followed by the 10-digit Indian mobile number. When a shop places an order on this browser, WhatsApp opens with the order message ready to send.</p><div className="notice info"><AlertTriangle size={18}/>WhatsApp cannot send silently: the owner/shop must confirm Send. Automatic WhatsApp delivery needs the WhatsApp Business Platform and a backend.</div><label>SMS notification number (for future setup)<input value={notificationNumber} onChange={e=>setNotificationNumber(e.target.value)} placeholder="10-digit mobile number"/></label><p className="help-text">Regular SMS cannot be sent by a website alone. To enable automatic SMS, connect an SMS gateway (such as MSG91 or Twilio) on a secure backend.</p><button className="primary" onClick={()=>setNotice('Notification settings saved in this browser.')}>Save notification settings</button></div>}
      {page==='catalog'&&!isOwner&&<><section className="shop-banner"><div><span className="eyebrow light">SHOP ORDER PORTAL</span><h1>Restock your shop,<br/>without the phone calls.</h1><p>Choose the products and pack quantities you need.</p></div><Store size={54}/></section><form onSubmit={placeOrder}><div className="shop-details"><label>Shop name<input value={shopName} onChange={e=>setShopName(e.target.value)} required placeholder="Enter your shop name"/></label><label>Shop contact number<input value={shopPhone} onChange={e=>setShopPhone(e.target.value)} placeholder="Optional mobile number"/></label><label>Delivery location<select value={location} onChange={e=>setLocation(e.target.value)}>{LOCATIONS.map(x=><option key={x}>{x}</option>)}</select></label></div>
        <div className="toolbar"><div className="searchbox"><Search size={17}/><input placeholder="Search products or brands..." value={query} onChange={e=>setQuery(e.target.value)}/></div><span className="muted small-text">{products.length} products available</span></div>
        <div className="catalog-grid">{filtered.map(p=><article className="catalog-card" key={p.id}><ProductImage product={p} size={180} borderRadius={16} style={{width:'100%',height:'180px',objectFit:'cover',marginBottom:'12px',borderRadius:'12px 12px 0 0'}}/><span className="brand-tag">{p.brand}</span><h3>{p.name}</h3><p className="pack">{p.weight} · {p.category}</p><div className="catalog-bottom"><div><strong>{fmt(p.price)}</strong><span className={p.stock<20?'warning-text':'stock-text'}>{p.stock>0?`${p.stock} units available`:'Out of stock'}</span></div><label className="qty-control"><span>Qty</span><input aria-label={`Quantity for ${p.name}`} type="number" min="0" max={p.stock} disabled={p.stock===0} value={cart[p.id]||''} onChange={e=>setQty(p.id,e.target.value)} placeholder="0"/></label></div></article>)}</div>
        <div className="checkout-bar"><div><span>{Object.values(cart).reduce((a,n)=>a+Number(n||0),0)} units selected</span><strong>{fmt(products.reduce((a,p)=>a+Number(cart[p.id]||0)*p.price,0))}</strong></div><button className="primary" type="submit"><ClipboardList size={18}/> Place order</button></div></form></>}
      {page==='myorders'&&!isOwner&&<><div className="section-heading"><div><h3>Order history</h3><p>Orders placed from this browser session.</p></div><button className="primary" onClick={()=>setPage('catalog')}>Order products</button></div><OrderTable orders={orders} updateStatus={()=>{}} detailed shopView/></>}
      <footer className="footer"><span>© {new Date().getFullYear()} DHARMATEJA AGENCIES</span><span>Distribution management workspace</span></footer>
    </main>
  </div>;
}

function ProductImage({ product, size = 38, borderRadius = 10, style = {} }) {
  return <img src={product?.image || '/products/default-product.svg'} alt={product?.name || 'Product'} loading="lazy" style={{ width: size, height: size, objectFit: 'cover', borderRadius, display: 'block', flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(23, 107, 72, 0.08)', ...style }} />;
}
function Stat({icon:Icon,label,value,sub}){return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={19}/></div></div><strong>{value}</strong><p>{sub}</p></div>}
function OrderTable({orders,updateStatus,detailed=false,shopView=false}){
  if(!orders.length)return <div className="empty-card"><div className="empty-icon"><ClipboardList size={25}/></div><h3>No orders yet</h3><p>When a shop places an order, it will appear here.</p></div>;
  return <div className="table-card"><table><thead><tr><th>Order / shop</th><th>Location</th><th>Items</th><th>Total</th><th>Status</th>{detailed&&!shopView&&<th>Update</th>}</tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><div className="order-name"><strong>{o.id}</strong><span>{o.shopName}</span>{detailed&&<small>{o.createdAt}</small>}</div></td><td><span className="location-cell"><MapPin size={14}/>{o.location}</span></td><td><div className="item-summary">{o.items.map(i=>`${i.name} × ${i.quantity}`).join(', ')}</div></td><td className="money">{'₹'+Number(o.total).toLocaleString('en-IN')}</td><td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td>{detailed&&!shopView&&<td><select className="status-select" value={o.status} onChange={e=>updateStatus(o.id,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Dispatched</option><option>Delivered</option><option>Cancelled</option></select></td>}</tr>)}</tbody></table></div>;
}