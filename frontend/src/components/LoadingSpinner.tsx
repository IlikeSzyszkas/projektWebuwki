interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: Props) {
  return (
    <div className="spinner-wrapper" role="status">
      <div className="spinner" />
      <p className="spinner-text">{message}</p>
    </div>
  );
}
