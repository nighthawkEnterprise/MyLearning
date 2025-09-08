// app/components/GradientTopAccent.jsx
export default function GradientTopAccent() {
    return (
      <div className="pointer-events-none fixed inset-x-0 -top-32 z-0 blur-3xl">
        <div className="mx-auto h-64 w-11/12 max-w-6xl rounded-3xl bg-gradient-to-r from-rose-200 via-fuchsia-200 to-sky-200 opacity-60" />
      </div>
    );
  }
  