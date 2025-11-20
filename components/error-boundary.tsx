"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error("[v0] Three.js Error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white p-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-cyan-400">Something went wrong with the 3D rendering</h1>

            <div className="mb-6 p-4 bg-gray-900 rounded-lg">
              <p className="text-magenta-300 font-mono text-sm break-words">
                {this.state.error?.message || "An unknown error occurred"}
              </p>
            </div>

            <div className="mb-6 text-left text-sm text-gray-400">
              <p className="mb-2 font-semibold text-white">Common causes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>WebGL context initialization failed</li>
                <li>Graphics driver issues or outdated drivers</li>
                <li>Browser doesn't support required WebGL features</li>
                <li>GPU memory exhausted</li>
                <li>Hardware acceleration disabled</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.resetError}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors font-semibold"
              >
                Try again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-magenta-500 text-white rounded-lg hover:bg-magenta-400 transition-colors font-semibold"
              >
                Reload page
              </button>
            </div>

            {this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300">Show technical details</summary>
                <pre className="mt-2 p-4 bg-gray-900 rounded text-xs overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
