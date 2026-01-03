// Cache DOM elements
const instituteNameInput = document.getElementById('instituteName');
const instituteLogoInput = document.getElementById('instituteLogo');
const userPhotoInput = document.getElementById('userPhoto');
const fullNameInput = document.getElementById('fullName');
const positionInput = document.getElementById('position');
const idNumberInput = document.getElementById('idNumber');
const courseDeptInput = document.getElementById('courseDept');
const issueDateInput = document.getElementById('issueDate');
const expireDateInput = document.getElementById('expireDate');
const fontFamilySelect = document.getElementById('fontFamily');
const colorStartInput = document.getElementById('colorStart');
const colorEndInput = document.getElementById('colorEnd');
const textColorOverrideInput = document.getElementById('textColorOverride');
const downloadBtn = document.getElementById('downloadBtn');

const card = document.getElementById('idCard');
const cardInstituteName = document.getElementById('cardInstituteName');
const cardLogo = document.getElementById('cardLogo');
const cardPhoto = document.getElementById('cardPhoto');
const cardSignature = document.getElementById('cardSignature');
const cardName = document.getElementById('cardName');
const cardPosition = document.getElementById('cardPosition');
const cardID = document.getElementById('cardID');
const cardCourse = document.getElementById('cardCourse');
const cardIssue = document.getElementById('cardIssue');
const cardExpire = document.getElementById('cardExpire');

// Default placeholders
const defaultLogo = 'assets/logo.png';
const defaultUserPhoto = 'assets/user-placeholder.png';
const defaultSignature = 'assets/signature.png';

// Update card text content and images live
function updateCard() {
  cardInstituteName.textContent = instituteNameInput.value.trim() || 'Institute Name';
  cardName.textContent = fullNameInput.value.trim() || 'Your Name';
  cardPosition.textContent = positionInput.value.trim() || 'Position';
  cardID.textContent = idNumberInput.value.trim() || '0000';
  cardCourse.textContent = courseDeptInput.value.trim() || 'Course/Department';

  // Format dates to dd-mm-yyyy or default placeholder
  const issueDate = issueDateInput.value ? formatDate(issueDateInput.value) : 'dd-mm-yyyy';
  const expireDate = expireDateInput.value ? formatDate(expireDateInput.value) : 'dd-mm-yyyy';
  cardIssue.textContent = issueDate;
  cardExpire.textContent = expireDate;

  // Font family
  card.style.fontFamily = fontFamilySelect.value;

  // Gradient background
  const startColor = colorStartInput.value;
  const endColor = colorEndInput.value;
  card.style.background = `linear-gradient(135deg, ${startColor}, ${endColor})`;

  // Dynamic text color based on background brightness or user override
  if (textColorOverrideInput.value) {
    card.style.color = textColorOverrideInput.value;
  } else {
    const avgBrightness = (getBrightness(startColor) + getBrightness(endColor)) / 2;
    card.style.color = avgBrightness < 130 ? 'white' : 'black';
  }
}

// Format date string YYYY-MM-DD to DD-MM-YYYY
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// Calculate brightness of a hex color (0-255)
function getBrightness(hex) {
  const c = hex.substring(1); // remove #
  const rgb = parseInt(c, 16); // convert to int
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  // Perceived brightness formula
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// Handle image uploads and preview
function handleImageUpload(inputElem, imgElem, defaultSrc) {
  if (inputElem.files && inputElem.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgElem.src = e.target.result;
    };
    reader.readAsDataURL(inputElem.files[0]);
  } else {
    imgElem.src = defaultSrc;
  }
}

// Event Listeners for live update
[
  instituteNameInput,
  fullNameInput,
  positionInput,
  idNumberInput,
  courseDeptInput,
  issueDateInput,
  expireDateInput,
  fontFamilySelect,
  colorStartInput,
  colorEndInput,
  textColorOverrideInput
].forEach((input) => {
  input.addEventListener('input', updateCard);
});

instituteLogoInput.addEventListener('change', () => {
  handleImageUpload(instituteLogoInput, cardLogo, defaultLogo);
});
userPhotoInput.addEventListener('change', () => {
  handleImageUpload(userPhotoInput, cardPhoto, defaultUserPhoto);
});

// Initialize with default signature image
cardSignature.src = defaultSignature;

// Initialize card on page load
window.addEventListener('DOMContentLoaded', updateCard);

// Download card as PNG using html2canvas
downloadBtn.addEventListener('click', () => {
  // Disable button temporarily
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Preparing...';

  html2canvas(card).then(canvas => {
    // Create link to download image
    const link = document.createElement('a');
    const fileName = `${fullNameInput.value.trim() || 'IDCard'}.png`;
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Reset button
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download ID Card';
  }).catch(() => {
    alert('Failed to generate image. Please try again.');
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download ID Card';
  });
});
