import { FC, useState, useEffect } from "react";

interface WithDelayProps {
  ms?: number;
}

const DEFAULT_MS = 500;

export default function withDelay<T extends object>(
  Component: FC<T>,
  isHidden?: boolean,
  ms = DEFAULT_MS
) {
  return (props: WithDelayProps & T) => {
    const [render, setRender] = useState(false);

    useEffect(
      () =>
        clearTimeout.bind(
          null,
          setTimeout(() => setRender(true), props.ms ?? ms)
        ),
      []
    );

    return (
      <>
        {isHidden ? (
          <div style={{ visibility: render ? "unset" : "hidden" }}>
            <Component {...props} />
          </div>
        ) : (
          render && <Component {...props} />
        )}
      </>
    );
  };
}
