import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    maxWidth: '800px',
                    margin: '40px auto',
                    backgroundColor: '#fee',
                    border: '2px solid #f00',
                    borderRadius: '8px',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                    <h1 style={{ color: '#c00', marginBottom: '20px' }}>⚠️ Something went wrong</h1>
                    <details style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                            Error Details (click to expand)
                        </summary>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '15px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            overflow: 'auto'
                        }}>
                            <p><strong>Error:</strong> {this.state.error?.toString()}</p>
                            <p><strong>Stack:</strong></p>
                            <pre>{this.state.error?.stack}</pre>
                            {this.state.errorInfo && (
                                <>
                                    <p><strong>Component Stack:</strong></p>
                                    <pre>{this.state.errorInfo.componentStack}</pre>
                                </>
                            )}
                        </div>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#34ae6f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
