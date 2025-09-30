export type Story = {
  id: string;
  title: string;
  cover: string; // image url
  href?: string; // original link
  views?: number; // e.g. 201630
  chapters?: number; // e.g. 51
  latestChapterTitle?: string; // e.g. Chương 7: ...
  timeAgo?: string; // e.g. 2 phút trước
  isFull?: boolean;
};

export type RootStackParamList = {
  Home: undefined;
  StoryDetail: { id: string };
};
