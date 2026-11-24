import { Component } from "react";

export default class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            width: "100%",
            height: "100%",
            minHeight: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            textAlign: "center",
            color: "#475569",
            background: "#f8fafc",
            fontSize: 14,
          }}
        >
          This model could not be loaded.
        </div>
      );
    }

    return this.props.children;
  }
}
