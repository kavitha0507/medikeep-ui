# 💊 MediKeep: Accessible Medication Tracker
**A Full-Stack Healthcare Solution for Elderly Users**

MediKeep is a specialized medication management application designed with a focus on **UI/UX Accessibility**. It allows users to track their daily medications, providing visual and auditory feedback to ensure health safety.



## ✨ Key Features
* **Full CRUD Functionality**: Add, View, and Delete medications with real-time updates.
* **Voice Instructions**: Integrated Web Speech API to read dosage and timing out loud for low-vision users.
* **Real-time Progress Tracking**: A dynamic progress bar that calculates daily completion percentage.
* **Smart History**: Automatically records exact timestamps when a medication is marked as taken.
* **Responsive Modern UI**: Built with a mobile-first approach using Tailwind CSS and Lucide icons.

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js (React), Tailwind CSS, Lucide React |
| **Backend** | Java Spring Boot, Spring Data JPA |
| **Database** | MySQL |
| **API** | RESTful API with CORS configuration |

## 🎨 UI/UX Design Decisions
As a **UI/UX Designer**, I prioritized:
1.  **High Contrast & Large Typography**: Ensuring readability for elderly users.
2.  **Visual Affirmation**: Using green checkmarks and "Taken" states to prevent double-dosing errors.
3.  **Auditory Feedback**: Voice confirmation for dose recording to provide multimodal accessibility.



## 🚀 Getting Started
1. **Backend**: Navigate to `/medikeep` and run `.\mvnw.cmd spring-boot:run`.
2. **Frontend**: Navigate to `/medikeep-ui` and run `npm run dev`.
3. **Database**: Ensure MySQL is running on port 3306 with a `medikeep` schema.
