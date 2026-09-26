import React from "react";
import { isChunkLoadError, reloadOnceForChunkError } from "@/utils/chunkLoadError.mjs";

type Props = { children: React.ReactNode };
type State = { error: unknown; reloading: boolean };

/**
 * A failed lazy chunk reloads the document once. It does not render an
 * error screen on that first failure.
 */
export default class ChunkErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, reloading: false };

  static getDerivedStateFromError(error: unknown): State {
    return { error, reloading: false };
  }

  componentDidCatch(error: unknown) {
    if (!isChunkLoadError(error)) return;
    const reloading = reloadOnceForChunkError();
    if (reloading) this.setState({ reloading: true });
  }

  render() {
    const { error, reloading } = this.state;
    if (!error) return this.props.children;
    if (isChunkLoadError(error) && reloading) return null;

    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Pagina kon niet geladen worden
          </h1>
          <p className="text-gray-600 mb-6">
            Vernieuw de pagina of ga terug naar de startpagina van NieuweVloer.
          </p>
          <p className="text-gray-800 mb-6">
            Bel{" "}
            <a href="tel:0479304986" className="font-semibold text-primary">
              0479 30 49 86
            </a>
          </p>
          <a href="/" className="text-primary font-medium underline">
            Naar de startpagina
          </a>
        </div>
      </div>
    );
  }
}
