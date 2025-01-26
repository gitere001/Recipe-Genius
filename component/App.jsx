import Header from "./header";
import Main from "./home";
import Modal from "./Modal";
import { useState } from "react";
import LoginModal from "./login";
import { createPortal } from "react-dom";
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const [feedbackSuccessful, setFeedbackSuccessful] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [hasFeedback, setHasFeedback] = useState(false);
  console.log(submiting)

  return (
    <>
      {createPortal(
        <div className={`login-signup-modal ${showLoginModal ? "" : "hidden"}`}>
          <LoginModal
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            submiting={submiting}
            setSubmiting={setSubmiting}
            feedbackSuccessful={feedbackSuccessful}
            setFeedbackSuccessful={setFeedbackSuccessful}
            feedbackMessage={feedbackMessage}
            setFeedbackMessage={setFeedbackMessage}
            hasFeedback={hasFeedback}
            setHasFeedback={setHasFeedback}
          />
        </div>,
        document.body
      )}

      <Header setActiveModal={setActiveModal} setShowOverlay={setShowOverlay} />
      <Modal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        submiting={submiting}
        setSubmiting={setSubmiting}
        feedbackSuccessful={feedbackSuccessful}
        setFeedbackSuccessful={setFeedbackSuccessful}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        hasFeedback={hasFeedback}
        setHasFeedback={setHasFeedback}
      />

      <Main />
    </>
  );
}
