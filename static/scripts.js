const API_URL = "https://waste-segregation-i0xi.onrender.com/predict";

// ------------------------------
// Tab switching
// ------------------------------
function showTab(tabId, btn) {
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  // stop live detection when switching away
  if (tabId !== "liveTab") stopLiveDetection();
}

// ------------------------------
// Tips dictionary
// ------------------------------
const tips = {
  plastic: "Tip: Rinse and dry plastic before recycling.",
  glass: "Tip: Handle glass carefully and recycle separately.",
  paper: "Tip: Keep paper dry for better recycling.",
  cardboard: "Tip: Flatten boxes to save space.",
  metal: "Tip: Clean metal cans before recycling.",
  trash: "Tip: Use general waste bin. Avoid mixing recyclables.",
};

// ------------------------------
// Upload logic
// ------------------------------
let uploadedImage = null;

function handleUpload(input) {
  const file = input.files[0];
  if (!file) return;

  uploadedImage = file;
  document.getElementById("uploadedImageText").innerHTML = `
    <img src="${URL.createObjectURL(file)}"
         style="max-width:140px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);" />
  `;

  document.getElementById("segmentationText").innerText = "Ready to process ✅";

  // reset confidence UI
  const segConf = document.getElementById("segConfidence");
  if (segConf) segConf.style.display = "none";
  const fill = document.getElementById("confidenceFill");
  if (fill) fill.style.width = "0%";
  const ctext = document.getElementById("confidenceText");
  if (ctext) ctext.innerText = "";
}

function resetUpload() {
  uploadedImage = null;

  document.getElementById("uploadedImageText").innerText = "No image uploaded";
  document.getElementById("segmentationText").innerText = "Results will appear here";

  // reset confidence UI
  const segConf = document.getElementById("segConfidence");
  if (segConf) segConf.style.display = "none";
  const fill = document.getElementById("confidenceFill");
  if (fill) fill.style.width = "0%";
  const ctext = document.getElementById("confidenceText");
  if (ctext) ctext.innerText = "";
}

// ------------------------------
// CAMERA STREAMS (separate streams ✅)
// ------------------------------
let captureStream = null;
let liveStream = null;
let currentFacingMode = "environment";

// helper to start camera
function startCamera(videoId, facingMode, mode = "capture") {
  const constraints = { video: { facingMode }, audio: false };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((s) => {
      const video = document.getElementById(videoId);

      if (mode === "capture") {
        if (captureStream) captureStream.getTracks().forEach((t) => t.stop());
        captureStream = s;
      } else {
        if (liveStream) liveStream.getTracks().forEach((t) => t.stop());
        liveStream = s;
      }

      video.srcObject = s;
    })
    .catch((err) => {
      console.error("Camera error:", err);
      alert("Camera permission denied / camera not available.");
    });
}

// ------------------------------
// 1) Upload Predict
// ------------------------------
function processImage() {
  const btn = document.getElementById("processBtn") || document.querySelector(".action-btn.process");

  if (!uploadedImage) {
    document.getElementById("segmentationText").innerText = "Please upload an image first.";
    return;
  }

  // disable button + loading
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
  }

  document.getElementById("segmentationText").innerHTML = `
    <span style="color:var(--primary);">
      <i class="fa fa-spinner fa-spin"></i> Processing...
    </span>
  `;

  const formData = new FormData();
  formData.append("image", uploadedImage);

  fetch(API_URL, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const resultRaw = data.result || data.prediction || "No prediction";
      const result = resultRaw.toLowerCase();
      const tip = tips[result]
        ? `<br><span style="font-size:1rem;color:var(--muted);">${tips[result]}</span>`
        : "";

      document.getElementById("segmentationText").innerHTML = `
        <span style="color:var(--success); font-weight:700;">
          ${result.toUpperCase()}
        </span>${tip}
      `;

      // Confidence UI
      if (data.confidence !== undefined) {
        const segConf = document.getElementById("segConfidence");
        const fill = document.getElementById("confidenceFill");
        const ctext = document.getElementById("confidenceText");

        if (segConf && fill && ctext) {
          segConf.style.display = "block";
          const percent = Math.round(Number(data.confidence) * 100);
          fill.style.width = percent + "%";
          ctext.innerText = `Confidence: ${percent}%`;
        }
      }
    })
    .catch((err) => {
      console.error("Upload prediction error:", err);
      document.getElementById("segmentationText").innerHTML = `
        <span style="color:var(--danger);">Prediction failed. Try again.</span>
      `;
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = "Process Image";
      }
    });
}

// ------------------------------
// 2) Capture Predict
// ------------------------------
function captureImage() {
  const video = document.getElementById("camera");
  const captureBtn = document.getElementById("captureBtn") || document.querySelector("#captureTab .upload-label");

  if (!video || video.readyState !== 4) {
    alert("Camera not ready. Please wait.");
    return;
  }

  if (captureBtn) {
    captureBtn.disabled = true;
    captureBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Capturing...';
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0);

  const imgDataUrl = canvas.toDataURL("image/jpeg");
  document.getElementById("capturedImageText").innerHTML = `
    <img src="${imgDataUrl}"
         style="max-width:140px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);" />
  `;

  document.getElementById("captureResultText").innerHTML = `
    <span style="color:var(--primary);">
      <i class="fa fa-spinner fa-spin"></i> Processing...
    </span>
  `;

  canvas.toBlob(
    (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      fetch(API_URL, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          const resultRaw = data.result || data.prediction || "No prediction";
          const result = resultRaw.toLowerCase();
          const confidence = data.confidence !== undefined ? ` (${(data.confidence * 100).toFixed(1)}%)` : "";
          const tip = tips[result]
            ? `<br><span style="font-size:1rem;color:var(--muted);">${tips[result]}</span>`
            : "";

          document.getElementById("captureResultText").innerHTML = `
            <span style="color:var(--success); font-weight:700;">
              ${result.toUpperCase()}${confidence}
            </span>${tip}
          `;
        })
        .catch((err) => {
          console.error("Capture prediction error:", err);
          document.getElementById("captureResultText").innerHTML = `
            <span style="color:var(--danger);">Prediction failed. Try again.</span>
          `;
        })
        .finally(() => {
          if (captureBtn) {
            captureBtn.disabled = false;
            captureBtn.innerHTML = "Capture";
          }
        });
    },
    "image/jpeg"
  );
}

function flipCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  startCamera("camera", currentFacingMode, "capture");
}

// ------------------------------
// 3) Live Detection
// ------------------------------
let liveDetectionActive = false;

function flipRealtimeCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  startCamera("realtimeCamera", currentFacingMode, "live");
  setTimeout(startLiveDetection, 1200);
}

function stopLiveDetection() {
  liveDetectionActive = false;
  const box = document.getElementById("realtimeResultText");
  if (box) box.innerText = "Live detection stopped.";

  if (liveStream) liveStream.getTracks().forEach((t) => t.stop());
  liveStream = null;
}

function startLiveDetection() {
  const video = document.getElementById("realtimeCamera");
  const resultBox = document.getElementById("realtimeResultText");

  if (!video) return;

  liveDetectionActive = true;
  let firstRun = true;

  function sendFrame() {
    if (!liveDetectionActive) return;

    if (video.readyState === 4) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas.getContext("2d").drawImage(video, 0, 0);

      canvas.toBlob(
        (blob) => {
          const formData = new FormData();
          formData.append("image", blob, "frame.jpg");

          if (firstRun && resultBox) {
            resultBox.innerHTML = `
              <span style="color:var(--primary);">
                <i class="fa fa-spinner fa-spin"></i> Detecting...
              </span>
            `;
            firstRun = false;
          }

          fetch(API_URL, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              const resultRaw = data.result || data.prediction || "No prediction";
              const result = resultRaw.toLowerCase();
              const confidence = data.confidence !== undefined ? ` (${(data.confidence * 100).toFixed(1)}%)` : "";

              if (resultBox) {
                resultBox.innerHTML = `
                  <span style="color:var(--success); font-weight:700;">
                    ${result.toUpperCase()}${confidence}
                  </span>
                `;
              }

              setTimeout(sendFrame, 1200);
            })
            .catch((err) => {
              console.error("Live prediction error:", err);
              if (resultBox) {
                resultBox.innerHTML = `<span style="color:var(--danger);">Prediction failed.</span>`;
              }
              setTimeout(sendFrame, 2000);
            });
        },
        "image/jpeg"
      );
    } else {
      setTimeout(sendFrame, 600);
    }
  }

  sendFrame();
}

// ------------------------------
// Tab Event Listeners
// ------------------------------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.textContent.includes("Webcam")) {
      startCamera("camera", currentFacingMode, "capture");
    }

    if (btn.textContent.includes("Live")) {
      startCamera("realtimeCamera", currentFacingMode, "live");
      setTimeout(startLiveDetection, 1200);
    }

    if (btn.textContent.includes("Upload")) {
      // stop all streams on upload tab
      if (captureStream) captureStream.getTracks().forEach((t) => t.stop());
      if (liveStream) liveStream.getTracks().forEach((t) => t.stop());
    }
  });
});

// ------------------------------
// Drag & drop upload
// ------------------------------
const uploadDrop = document.getElementById("uploadDrop");

if (uploadDrop) {
  uploadDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadDrop.style.background = "rgba(33,200,122,0.10)";
  });

  uploadDrop.addEventListener("dragleave", (e) => {
    e.preventDefault();
    uploadDrop.style.background = "rgba(33,200,122,0.07)";
  });

  uploadDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadDrop.style.background = "rgba(33,200,122,0.07)";
    const files = e.dataTransfer.files;

    if (files.length) {
      document.querySelector('.upload-label input[type="file"]').files = files;
      handleUpload({ files });
    }
  });
}
