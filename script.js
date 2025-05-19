let originalImage = new Image();
let rotation = 0;
let flipH = false;
let flipV = false;

document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(evt) {
    originalImage.onload = function() {
      document.getElementById('width').value = originalImage.width;
      document.getElementById('height').value = originalImage.height;
    };
    originalImage.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('width').addEventListener('input', function() {
  if (document.getElementById('aspectRatio').checked) {
    const ratio = originalImage.height / originalImage.width;
    document.getElementById('height').value = Math.round(this.value * ratio);
  }
});

document.getElementById('height').addEventListener('input', function() {
  if (document.getElementById('aspectRatio').checked) {
    const ratio = originalImage.width / originalImage.height;
    document.getElementById('width').value = Math.round(this.value * ratio);
  }
});

document.getElementById('quality').addEventListener('input', function () {
  document.getElementById('qualityValue').textContent = this.value + "%";
});

function flipImage(direction) {
  if (direction === 'horizontal') {
    flipH = !flipH;
  } else if (direction === 'vertical') {
    flipV = !flipV;
  }
}

function rotateImage() {
  rotation = (rotation + 90) % 360;
}

function resizeImage() {
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);
  const format = document.getElementById('format').value;
  const quality = parseInt(document.getElementById('quality').value) / 100;
  const grayscale = document.getElementById('grayscale').checked;

  if (!originalImage.src || !width || !height) {
    alert("Please upload an image and enter valid dimensions.");
    return;
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  ctx.save();

  // Flip and rotate
  if (flipH) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  if (flipV) {
    ctx.translate(0, height);
    ctx.scale(1, -1);
  }

  if (rotation !== 0) {
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
  }

  ctx.drawImage(originalImage, 0, 0, width, height);

  if (grayscale) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  ctx.restore();

  const outputImage = document.getElementById('outputImage');
  const dataUrl = canvas.toDataURL(format, quality);
  outputImage.src = dataUrl;
  outputImage.style.display = 'block';

  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = dataUrl;
  downloadLink.download = `resized-image.${format.split('/')[1]}`;
  downloadLink.style.display = 'inline-block';
}

function resetAll() {
  document.getElementById('imageInput').value = "";
  document.getElementById('width').value = "";
  document.getElementById('height').value = "";
  document.getElementById('aspectRatio').checked = false;
  document.getElementById('grayscale').checked = false;
  document.getElementById('quality').value = 100;
  document.getElementById('qualityValue').textContent = "100%";
  document.getElementById('format').value = "image/png";
  document.getElementById('outputImage').style.display = "none";
  document.getElementById('downloadLink').style.display = "none";
  originalImage = new Image();
  rotation = 0;
  flipH = false;
  flipV = false;
}
