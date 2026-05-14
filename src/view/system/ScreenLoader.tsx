import './css/ScreenLoader.css';

type ScreenLoaderProps = {
  title?: string;
  message: string;
  description?: string;
};

export function ScreenLoader({
  description,
  message,
  title,
}: ScreenLoaderProps) {
  return (
    <div className="screen-loader">
      {title ? <strong>{title}</strong> : null}
      <span>{message}</span>
      {description ? <small>{description}</small> : null}
    </div>
  );
}
