import PropTypes from 'prop-types';
import './components-styles/feedback.css';

export default function FeedBack(props) {
  
  return (
    props.hasFeedback && (
      <div
        className={`feed-back ${
          props.isSuccessful ? 'success-feedback' : 'error-feedback'
        }`}
      >
        <p>{props.message}</p>
      </div>
    )
  );
}

FeedBack.propTypes = {
  hasFeedback: PropTypes.bool.isRequired,
  isSuccessful: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};
