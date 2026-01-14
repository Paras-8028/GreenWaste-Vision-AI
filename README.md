<<<<<<< HEAD
# 🌿 GreenWaste-Vision-AI  
**AI-Powered Waste Classification & Sustainable Segregation System**

GreenWaste-Vision-AI is a Computer Vision based sustainability project that classifies waste into categories such as **plastic, paper, metal, glass, cardboard, and trash** using a deep learning model.  
The goal is to support **smart waste segregation** and encourage **recycling and responsible waste management**.

---

## 🎯 Problem Statement
Waste segregation is a major challenge in cities and communities. Incorrect disposal leads to:
- low recycling rates  
- landfill overflow  
- pollution and environmental damage  

This project uses **AI-based image classification** to help users identify the type of waste and dispose of it correctly.

---

## 🌍 SDG Alignment (UN Sustainable Development Goals)
This project contributes to the following SDGs:

### ✅ Primary SDG: **SDG 11 – Sustainable Cities and Communities**
- Helps build cleaner cities through proper waste management and awareness.

### ✅ Secondary SDG: **SDG 12 – Responsible Consumption and Production**
- Promotes recycling and reduces landfill waste through better segregation.

---

## 🚀 Features
✅ Waste classification using AI (image/webcam based)  
✅ User-friendly interface (web app)  
✅ Supports multiple waste categories:  
- Plastic  
- Glass  
- Metal  
- Paper  
- Cardboard  
- Trash  

✅ Helps in awareness & sustainable disposal practices

---

## 🧠 AI & Model Details
- Model Architecture: **MobileNetV2 Transfer Learning**
- Input Size: **224 x 224**
- Output: Waste class prediction
- Framework: **TensorFlow / Keras**
- Dataset: Garbage classification dataset (Kaggle)

---

## 🛠️ Tech Stack
- **Python**
- **TensorFlow / Keras**
- **OpenCV**
- **Flask**
- **NumPy**
- **Matplotlib**
- **Scikit-learn**

---

## 📂 Project Structure
```bash
GreenWaste-Vision-AI/
│── app.py
│── requirements.txt
│── templates/
│── static/
│── Google Colab/
│── Model/
│── Garbage classification/   # dataset (optional, not for github upload)
│── README.md
│── .gitignore

---

🔐 Responsible AI Considerations (Mandatory)

This project follows Responsible AI guidelines:

✅ Fairness

The model is trained on multiple waste classes to reduce biased predictions.

Continuous improvement is possible by adding more diverse images.

✅ Transparency

The system clearly displays the predicted class (waste category).

Users can understand the output without hidden decision making.

✅ Privacy

No personal user data is collected.

Uploaded images are used only for classification and not stored permanently.

✅ Ethical Use

The model is intended only for sustainable waste management.

It avoids harmful, misleading, or discriminatory use.

🌱 Impact

✅ Improves waste segregation awareness
✅ Supports recycling & sustainable disposal
✅ Helps reduce landfill and pollution
✅ Contributes to clean cities and communities

🔮 Future Enhancements

Add E-waste category and more waste classes

Improve real-time classification accuracy

Deploy online using Render/Heroku

Integrate nearest recycling center suggestion feature

👤 Author

Maharudra Patil + Yash Umdale + Kartik Swami
AI + Sustainability Virtual Internship Project
(IBM SkillsBuild & AICTE)

⭐ Acknowledgements

IBM SkillsBuild + AICTE Internship Program

Kaggle Dataset providers

TensorFlow / Keras community
