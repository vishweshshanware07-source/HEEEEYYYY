// script.js — simple, robust, catchable Chum-Chum game with upload fallback

const startBtn = document.getElementById('startBtn');
const fileInput = document.getElementById('fileInput');
const uploadLabel = document.getElementById('uploadLabel');
const messageBox = document.getElementById('messageBox');
const chum = document.getElementById('chum');
const imageError = document.getElementById('imageError');

let moveInterval = null;
let usingUploadedImage = false;

// final emotional message (exact tone you provided, formatted)
const finalMessage = `
I just wanted to tell you something today…
I’ve really noticed how much you’re growing in your own way.
The way you’ve improved, the way you handle situations,
your ambition, your mindset,
even the way you understand people and their behavior everything shows how much you’re evolving.

You truly deserve to become stronger and more confident
with every step you take.
Try making decisions with a calm, clear mind, not just emotions  it will take you so far in life.

I’m saying all of this because I genuinely care about you… maybe more than I ever say out loud.
Your happiness really matters to me.
`;

// helper: show a short image error/tip
function showImageError(text){
  imageError.textContent = text;
  imageError.classList.remove('hidden');
  setTimeout(()=> imageError.classList.add('hidden'), 7000);
}

// try to load chum.png from repo root automatically
function tryLoadRepoImage(){
  chum.src = 'chum.png';
  // optimistic show — let browser attempt load; show upload option in case of error
  chum.onload = () => {
    imageError.classList.add('hidden');
    // image exists and loaded — keep upload label hidden
    uploadLabel.classList.add('hidden');
  };
  chum.onerror = () => {
    // file not found or broken — reveal upload control
    uploadLabel.classList.remove('hidden');
    showImageError("Can't find chum.png in repo root. Use Upload Chum-Chum to test locally.");
    chum.style.display = 'none';
  };
}

// allow user to upload an image from device (FileReader)
fileInput.addEventListener('change', (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    chum.src = e.target.result;
    usingUploadedImage = true;
    // clear any image error
    imageError.classList.add('hidden');
    uploadLabel.classList.add('hidden');
    // small delay to ensure image loads
    chum.onload = () => {
      // ready to start once user clicks yes
    };
  };
  reader.readAsDataURL(f);
});

// clicking start
startBtn.addEventListener('click', () => {
  // if chum already loaded, show it; otherwise prompt upload
  if(!chum.src || chum.naturalWidth === 0){
    // image not ready — ask user to upload
    uploadLabel.classList.remove('hidden');
    showImageError("Please upload the Chum-Chum image or add chum.png to the repo root.");
    return;
  }

  // hide controls and begin
  startBtn.style.display = 'none';
  uploadLabel.style.display = 'none';
  messageBox.textContent = 'Catch the Chum-Chum 💗';

  // display image and center it
  chum.style.display = 'block';
  chum.style.left = (window.innerWidth / 2) + 'px';
  chum.style.top = (window.innerHeight / 2) + 'px';

  startMovement();
});

// movement: slow, smooth, very catchable
function startMovement(){
  if(moveInterval) clearInterval(moveInterval);

  // move every 1800-2400ms (small randomization), CSS transitions provide smooth animation
  moveInterval = setInterval(() => {
    const margin = Math.max(140, chum.clientWidth + 40);
    const maxX = Math.max(window.innerWidth - margin, 20);
    const maxY = Math.max(window.innerHeight - margin, 20);
    const x = 20 + Math.random() * maxX;
    const y = 80 + Math.random() * maxY; // 80 to avoid header overlap
    chum.style.left = x + 'px';
    chum.style.top = y + 'px';
    chum.style.transform = 'translate(-50%,-50%) scale(1.03)';
    // relax back after small pop
    setTimeout(()=> chum.style.transform = 'translate(-50%,-50%) scale(1)', 400);
  }, 2000 + Math.floor(Math.random()*600)); // between 2000 and 2600ms
}

// catching: user clicks the image
chum.addEventListener('click', () => {
  if(moveInterval) clearInterval(moveInterval);
  // center and shrink a little
  chum.style.left = '50%';
  chum.style.top = '50%';
  chum.style.transform = 'translate(-50%,-50%) scale(0.96)';

  setTimeout(()=> {
    showFinalMessage();
  }, 320);
});

function showFinalMessage(){
  // hide image to make message clear, but keep visible for style
  chum.style.display = 'none';
  messageBox.textContent = '';
  // create a nicely formatted paragraph block
  const div = document.createElement('div');
  div.id = 'finalBox';
  div.style.position = 'fixed';
  div.style.left = '50%';
  div.style.top = '50%';
  div.style.transform = 'translate(-50%,-50%)';
  div.style.maxWidth = '760px';
  div.style.width = '90%';
  div.style.background = 'rgba(255,255,255,0.95)';
  div.style.color = '#222';
  div.style.borderRadius = '14px';
  div.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
  div.style.padding = '22px 26px';
  div.style.zIndex = 60;
  div.style.lineHeight = '1.45';
  div.style.fontWeight = 500;
  div.innerHTML = `<pre style="white-space:pre-wrap;font-family:inherit;font-size:1rem;margin:0">${finalMessage}</pre>`;

  // ok/restart button
  const ok = document.createElement('button');
  ok.id = 'okBtn';
  ok.textContent = 'OK';
  ok.style.marginTop = '14px';
  ok.style.padding = '10px 18px';
  ok.style.borderRadius = '10px';
  ok.style.border = 'none';
  ok.style.cursor = 'pointer';
  ok.style.fontWeight = 800;
  ok.style.background = '#ff2e5a';
  ok.style.color = '#fff';
  ok.addEventListener('click', () => {
    // restart page state
    div.remove();
    resetToStart();
  });

  div.appendChild(ok);
  document.body.appendChild(div);
}

function resetToStart(){
  // ensure chum visible only if image present
  chum.style.display = 'none';
  messageBox.textContent = 'Do you like Chum-Chum?';
  startBtn.style.display = 'inline-block';
  // show upload label if no repo image loaded
  if(!chum.src || chum.naturalWidth === 0) uploadLabel.classList.remove('hidden');
}

// on load try repo file
window.addEventListener('load', () => {
  tryLoadRepoImage();
});
(function setupBackgroundAudio(){
  const audio = document.getElementById('bgAudio');
  if(!audio) return;

  // small play button created if autoplay is blocked
  const btn = document.createElement('button');
  btn.id = 'audioPlayBtn';
  btn.innerText = 'Play Music';
  btn.className = 'hidden';
  document.body.appendChild(btn);

  // try autoplay on load
  window.addEventListener('load', () => {
    // attempt to play (may be blocked by browser)
    audio.play().then(() => {
      // playing succeeded
      btn.classList.add('hidden');
      btn.innerText = 'Pause';
      // change text if user wants to pause
    }).catch(() => {
      // autoplay blocked — show the small play button
      btn.classList.remove('hidden');
    });
  });

  // toggle play/pause on button click
  btn.addEventListener('click', () => {
    if(audio.paused){
      audio.play().then(()=> {
        btn.innerText = 'Pause';
      }).catch(()=> {
        // If still blocked, keep telling user
        alert('Autoplay blocked. Please tap the page to enable sound.');
      });
    } else {
      audio.pause();
      btn.innerText = 'Play Music';
    }
  });

  // optional: pause music when final message shows (keeps focus on message)
  const originalShowFinalMessage = window.showFinalMessage;
  if(typeof originalShowFinalMessage === 'function'){
    window.showFinalMessage = function(){ 
      audio.pause();
      originalShowFinalMessage();
    };
  }
})();
