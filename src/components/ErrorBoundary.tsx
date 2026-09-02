import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /* o que mostrar se algo dentro quebrar — por padrão, nada (some sem white-screen) */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/*
 * Em produção, um erro de renderização não tratado vira uma tela
 * branca. Este boundary captura qualquer erro da subtree e mostra
 * o fallback (ou nada), mantendo o resto da página vivo.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      console.error("[ErrorBoundary]", error, info);
    } catch {
      /* noop */
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
