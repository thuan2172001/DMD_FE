export default function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="mb-2 w-full">
      <p className="font-semibold" style={{ margin: 0 }}>
        {label}
      </p>
      <p>{value}</p>
    </div>
  );
}
