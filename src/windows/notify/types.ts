type NotificationLoadingState = {
  state: "loading";
  message: string;
  icon: string | undefined;
};

type NotificationErrorState = {
  state: "error";
  message: string;
  icon: string | undefined;
};

type NotificationLoggingState = {
  state: "logging";
  icon: string | undefined;
};

type NotificationHiddenState = {
  state: "hidden";
};

export type NotificationState =
  | NotificationLoggingState
  | NotificationLoadingState
  | NotificationErrorState
  | NotificationHiddenState;

export default NotificationState;
