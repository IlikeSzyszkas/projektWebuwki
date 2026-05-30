interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="error-box" role="alert">
      <span className="error-box__icon">!</span>
      <p className="error-box__text">{message}</p>
      {onRetry && (
        <button className="btn btn--outline" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
