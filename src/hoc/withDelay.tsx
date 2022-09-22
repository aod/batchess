import { FC, useState, useEffect } from "react";

interface WithDelayProps {
  ms?: number;
}

const DEFAULT_MS = 500;

export default function withDelay<T extends object>(Component: FC<T>) {
  return (props: WithDelayProps & T) => {
    const [render, setRender] = useState(false);

    useEffect(
      () =>
        clearTimeout.bind(
          null,
          setTimeout(() => setRender(true), props.ms ?? DEFAULT_MS)
        ),
      []
    );

    return <>{render && <Component {...props} />}</>;
  };
}
