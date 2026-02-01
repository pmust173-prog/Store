const products = [
  // using local image files from the `ai/image` folder — one distinct photo per product
  { id:1, name:'Classic Tee', price:29.99, img:'pexels-alokkd1-30999129 (1).jpg', isNew:true, sold:false, discount:0, description:'Comfortable cotton tee with a modern cut.', highlights:['100% cotton','Breathable','Machine washable'] },
  { id:2, name:'parfume', price:149.99, img:'pexels-jay-soundo-2148060180-33820362.jpg', isNew:false, sold:false, discount:50, description:'Premium leather jacket — timeless style.', highlights:['Genuine leather','Zip pockets','Tailored fit'] },
  { id:3, name:'john paul', price:59.99, img:'pexels-jay-soundo-2148060180-33820361.jpg', isNew:true, sold:false, discount:0, description:'Lightweight dress for warm days and evenings.', highlights:['Light fabric','Easy care','Flattering silhouette'] },
  { id:4, name:'Signature Perfume', price:79.99, img:'pexels-arturoaez225-10701986.jpg', isNew:false, sold:true, discount:0, description:'A long-lasting signature scent with floral notes.', highlights:['Long-lasting','Elegant bottle','Perfect gift'] },
  { id:5, name:'homme', price:89.99, img:'pexels-syednouman-7400855.jpg', isNew:false, sold:false, discount:50, description:'Comfortable sneakers for everyday wear.', highlights:['Cushioned sole','Breathable mesh','Durable outsole'] },
  { id:6, name:'Fragrance Gift Set', price:49.99, img:'pexels-god-picture-369194295-14466498.jpg', isNew:true, sold:false, discount:0, description:'Sampler set of our best fragrances.', highlights:['Includes 3 scents','Gift-ready','Travel size bottles'] }
];

const $products = document.getElementById('products');
const $filters = document.querySelectorAll('.filters button');
const $loginBtn = document.getElementById('loginBtn');
const $signupBtn = document.getElementById('signupBtn');
const $modal = document.getElementById('modal');
const $modalTitle = document.getElementById('modalTitle');
const $closeModal = document.getElementById('closeModal');
const $authForm = document.getElementById('authForm');
const $authMessage = document.getElementById('authMessage');
// auth additional elements
const $authUsername = document.getElementById('authUsername');
const $labelUsername = document.getElementById('labelUsername');
const $labelEmail = document.getElementById('labelEmail');
const $emailInput = document.getElementById('email');
// product modal elements
const $productModal = document.getElementById('productModal');
const $closeProductModal = document.getElementById('closeProductModal');
const $pmImages = document.getElementById('pmImages');
const $pmTitle = document.getElementById('pmTitle');
const $pmPrice = document.getElementById('pmPrice');
const $pmCoupon = document.getElementById('pmCoupon');
const $pmApplyCoupon = document.getElementById('pmApplyCoupon');
const $pmCouponMsg = document.getElementById('pmCouponMsg');
const $orderForm = document.getElementById('orderForm');
const $pmName = document.getElementById('pmName');
const $pmAddress = document.getElementById('pmAddress');
const $pmPhone = document.getElementById('pmPhone');
const $pmMessage = document.getElementById('pmMessage');
const $carPrev = () => document.querySelector('.car-prev');
const $carNext = () => document.querySelector('.car-next');

// Conversion: show prices in Algerian Dinar (DZD).
// Adjust `USD_TO_DZD` if you want a different exchange rate.
const USD_TO_DZD = 140; // example rate: 1 USD = 140 DZD
function formatPrice(n){
  const dzd = n * USD_TO_DZD;
  return dzd.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' DZD';
}

function renderProducts(filter='all'){
  $products.innerHTML='';
  const list = products.filter(p=>{
    if(filter==='all')return true;
    if(filter==='new')return p.isNew;
    if(filter==='sold')return p.sold;
    if(filter==='sale')return p.discount>=50;
    return true;
  });
  if(list.length===0){ $products.innerHTML='<p>No products match.</p>'; return }
  list.forEach(p=>{
    const card=document.createElement('article'); card.className='card';
    const imgWrap=document.createElement('div'); imgWrap.className='sold-overlay';
    const img=document.createElement('img'); img.className='thumb'; img.src=p.img; img.alt=p.name;
    imgWrap.appendChild(img);

    // description overlay (hidden until hover timeout)
    const overlay = document.createElement('div'); overlay.className = 'desc-overlay';
    const desc = document.createElement('div'); desc.className='desc-text'; desc.textContent = p.description || '';
    const ul = document.createElement('ul'); ul.className='desc-highlights';
    (p.highlights||[]).forEach(h=>{ const li = document.createElement('li'); li.textContent = '• ' + h; ul.appendChild(li); });
    overlay.appendChild(desc); overlay.appendChild(ul);
    overlay.style.display = 'none';
    imgWrap.appendChild(overlay);
    if(p.sold){ const s=document.createElement('div'); s.className='sold'; s.textContent='Sold Out'; imgWrap.appendChild(s) }
    card.appendChild(imgWrap);
    const title=document.createElement('div'); title.className='title'; title.textContent=p.name; card.appendChild(title);
    const priceDiv=document.createElement('div'); priceDiv.className='price';
    if(p.discount>0){ const orig=document.createElement('span'); orig.className='orig'; orig.textContent=formatPrice(p.price); priceDiv.appendChild(orig);
      const disc=parseFloat((p.price*(1-p.discount/100)).toFixed(2)); const now=document.createElement('span'); now.textContent=formatPrice(disc); priceDiv.appendChild(now);
    } else { priceDiv.textContent=formatPrice(p.price) }
    card.appendChild(priceDiv);
    // open detail on click
    card.style.cursor='pointer';
    card.addEventListener('click', ()=> openProductModal(p.id));

    // hover timer: show overlay after 5s on image
    let hoverTimer = null;
    imgWrap.addEventListener('mouseenter', ()=>{
      hoverTimer = setTimeout(()=>{ overlay.style.display='block'; overlay.classList.add('show'); }, 1500);
    });
    imgWrap.addEventListener('mouseleave', ()=>{ clearTimeout(hoverTimer); overlay.style.display='none'; overlay.classList.remove('show'); });
    $products.appendChild(card);
  });
}

// filters
document.querySelector('.filters').addEventListener('click', e=>{
  if(e.target.tagName!=='BUTTON')return;
  $filters.forEach(b=>b.classList.remove('active'));
  e.target.classList.add('active');
  renderProducts(e.target.dataset.filter);
});

// auth modal
$loginBtn.addEventListener('click', ()=>{ openModal('Log in') });
$signupBtn.addEventListener('click', ()=>{ openModal('Sign up') });
$closeModal.addEventListener('click', closeModal);
// close auth modal when clicking outside modal-content
if($modal){
  $modal.addEventListener('click', (e)=>{ if(e.target === $modal) closeModal(); });
}
function openModal(mode){ $modal.classList.remove('hidden'); $modalTitle.textContent=mode; $authMessage.textContent=''; }
function closeModal(){ $modal.classList.add('hidden'); }

$authForm.addEventListener('submit', e=>{
  e.preventDefault();
  // new flow: signup collects email (gmail), password and username.
  const username = ($authUsername && $authUsername.value ? $authUsername.value.trim() : '');
  const email = (document.getElementById('email').value || '').trim();
  const password = (document.getElementById('password').value || '').trim();
  const users = JSON.parse(localStorage.getItem('ms_users')||'{}');
  if($modalTitle.textContent==='Sign up'){
    if(!username || !email || !password){ $authMessage.style.color='#ff8b8b'; $authMessage.textContent='Please fill all fields'; return }
    if(users[username]){ $authMessage.style.color='#ff8b8b'; $authMessage.textContent='Username already exists'; return }
    users[username] = { email, password };
    localStorage.setItem('ms_users', JSON.stringify(users));
    // auto-login: save current user and close modal
    localStorage.setItem('ms_current_user', username);
    $authMessage.style.color='var(--accent)';
    $authMessage.textContent=`Account created — logged in as ${username}`;
    // update UI and close modal shortly after
    updateAuthUI();
    setTimeout(()=>{ closeModal(); }, 600);
    return;
  } else {
    // Log in by username + password
    if(!username || !password){ $authMessage.style.color='#ff8b8b'; $authMessage.textContent='Please enter username and password'; return }
    // allow login using username OR email
    let foundUsername = null;
    if(users[username] && users[username].password === password){
      foundUsername = username;
    } else {
      // try find by email
      for(const u in users){
        if(users[u].email && users[u].email.toLowerCase() === username.toLowerCase() && users[u].password === password){
          foundUsername = u; break;
        }
      }
    }
    if(foundUsername){
      localStorage.setItem('ms_current_user', foundUsername);
      $authMessage.style.color='var(--accent)';
      $authMessage.textContent='Logged in!';
      updateAuthUI();
      closeModal();
    } else {
      $authMessage.style.color='#ff8b8b'; $authMessage.textContent='Invalid username/email or password';
    }
  }
});

// show/hide fields depending on mode when opening modal
function openModal(mode){
  $modal.classList.remove('hidden');
  $modalTitle.textContent = mode;
  $authMessage.textContent = '';
  if(mode === 'Sign up'){
    if($labelUsername) $labelUsername.style.display = 'block';
    if($labelEmail) $labelEmail.style.display = 'block';
    if($emailInput) $emailInput.required = true;
  } else {
    if($labelUsername) $labelUsername.style.display = 'block';
    if($labelEmail) $labelEmail.style.display = 'none';
    if($emailInput) $emailInput.required = false;
  }
  $authForm.reset();
}

// hook the existing buttons to use the new openModal
$loginBtn.removeEventListener && $loginBtn.removeEventListener('click', ()=>{});
$loginBtn.addEventListener('click', ()=>{ openModal('Log in') });
$signupBtn.removeEventListener && $signupBtn.removeEventListener('click', ()=>{});
$signupBtn.addEventListener('click', ()=>{ openModal('Sign up') });

// update header UI to show avatar when logged in
function getInitials(name){
  if(!name) return '';
  return name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
}

function updateAuthUI(){
  const authDiv = document.querySelector('.auth');
  const current = localStorage.getItem('ms_current_user');
  if(current){
    // show avatar + username + logout
    authDiv.innerHTML = '';
    const wrap = document.createElement('div'); wrap.className='user';
    const avatar = document.createElement('button'); avatar.className='avatar'; avatar.textContent = getInitials(current);
    avatar.title = current;
    const uname = document.createElement('div'); uname.className='username'; uname.textContent = current;
    const logout = document.createElement('button'); logout.className='logout'; logout.textContent='Logout';
    logout.addEventListener('click', ()=>{ localStorage.removeItem('ms_current_user'); updateAuthUI(); });
    wrap.appendChild(avatar); wrap.appendChild(uname); wrap.appendChild(logout);
    authDiv.appendChild(wrap);
  } else {
    // restore login/signup buttons
    authDiv.innerHTML = `<button id="loginBtn">Log in</button><button id="signupBtn">Sign up</button>`;
    // rebind buttons
    const newLogin = document.getElementById('loginBtn');
    const newSignup = document.getElementById('signupBtn');
    newLogin.addEventListener('click', ()=>{ openModal('Log in') });
    newSignup.addEventListener('click', ()=>{ openModal('Sign up') });
  }
}

// call on load
updateAuthUI();


// Product detail modal logic
let currentImages = [];
let currentIndex = 0;
let currentProduct = null;

function openProductModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  currentProduct = p;
  // images: allow single string or array
  if(Array.isArray(p.img)) currentImages = p.img.slice();
  else currentImages = [p.img, p.img, p.img]; // duplicate for demo
  currentIndex = 0;
  renderPmImage();
  $pmTitle.textContent = p.name;
  // base price considering product discount
  const base = p.discount>0 ? parseFloat((p.price*(1-p.discount/100)).toFixed(2)) : p.price;
  $pmPrice.textContent = formatPrice(base);
  $pmCoupon.value = '';
  $pmCouponMsg.textContent = '';
  $pmMessage.textContent = '';
  $productModal.classList.remove('hidden');
  // attach prev/next handlers
  const prev = $carPrev(); const next = $carNext();
  if(prev) prev.onclick = ()=>{ currentIndex = (currentIndex-1+currentImages.length)%currentImages.length; renderPmImage(); };
  if(next) next.onclick = ()=>{ currentIndex = (currentIndex+1)%currentImages.length; renderPmImage(); };
}

function renderPmImage(){
  $pmImages.innerHTML = '';
  const img = document.createElement('img'); img.src = currentImages[currentIndex]; img.alt = currentProduct ? currentProduct.name : '';
  $pmImages.appendChild(img);
}

function closeProductModal(){
  $productModal.classList.add('hidden');
}

if($closeProductModal) $closeProductModal.addEventListener('click', closeProductModal);
// close product modal when clicking outside modal-content
if($productModal){
  $productModal.addEventListener('click', (e)=>{ if(e.target === $productModal) closeProductModal(); });
}

// coupon apply
if($pmApplyCoupon){
  $pmApplyCoupon.addEventListener('click', ()=>{
    if(!currentProduct) return;
    const code = ($pmCoupon.value||'').trim().toUpperCase();
    let extraDisc = 0;
    if(code==='SAVE10') extraDisc = 10;
    else if(code==='HALF50') extraDisc = 50;
    else if(code==='WELCOME5') extraDisc = 5;
    else if(code==='') { $pmCouponMsg.textContent='No coupon applied'; $pmCouponMsg.style.color=''; return }
    if(extraDisc>0){
      const base = currentProduct.discount>0 ? parseFloat((currentProduct.price*(1-currentProduct.discount/100)).toFixed(2)) : currentProduct.price;
      const newPrice = parseFloat((base*(1-extraDisc/100)).toFixed(2));
      $pmPrice.textContent = formatPrice(newPrice);
      $pmCouponMsg.textContent = `Applied ${extraDisc}% off`;
      $pmCouponMsg.style.color='var(--accent)';
    } else { $pmCouponMsg.textContent='Invalid coupon'; $pmCouponMsg.style.color='#ff8b8b' }
  });
}

// Order form
if($orderForm){
  $orderForm.addEventListener('submit', e=>{
    e.preventDefault();
    $pmMessage.textContent='';
    // simple validation: name, address, phone
    let ok = true;
    [$pmName, $pmAddress, $pmPhone].forEach(el=>{ if(!el.value || el.value.trim()===''){ el.classList.add('input-error'); ok=false } else el.classList.remove('input-error') });
    if(!ok){ $pmMessage.textContent='Please fill everything'; $pmMessage.style.color='#ff8b8b'; return }
    // success
    $pmMessage.textContent = 'Thank you — your order is placed! We will contact you.';
    $pmMessage.style.color = 'var(--accent)';
    // clear form
    $orderForm.reset();
    setTimeout(()=>{ closeProductModal(); }, 1800);
  });
  // clear error on input
  [$pmName, $pmAddress, $pmPhone].forEach(el=> el.addEventListener('input', ()=> el.classList.remove('input-error')));
}

// init
renderProducts('all');


