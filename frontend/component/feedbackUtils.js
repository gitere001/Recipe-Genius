// feedbackUtils.js (or in the same file)
export function handleErrorFeedback(
	setSubmiting,
	setHasFeedback,
	setFeedbackSuccessful,
	setFeedbackMessage
  ) {
	return (responseMessage) => {
	  setSubmiting(false);
	  setHasFeedback(true);
	  setFeedbackSuccessful(false);
	  setFeedbackMessage(responseMessage);
	};
  }
