type PostProps = {
  title: string;
  summary: string;
};

export default function Post({ title, summary }: PostProps) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{summary}</p>
      </div>
    </div>
  );
}
