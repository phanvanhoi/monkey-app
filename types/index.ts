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

// Type cho từng truyện trong bảng xếp hạng
export type Category = {
  id: number;
  slug: string;
  name: string;
};

export type Team = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

export type LastChapter = {
  id: number;
  slug: string;
  type: string;
  chapter_number: number;
  name: string | null;
};

export type Statistics = {
  id: number;
  modification_time: number;
  creation_time: number;
  total_watched: number;
  total_follow: number;
  daily_watched: number;
  weekly_watched: number;
  monthly_watched: number;
  comment: number;
  story: number;
};

export type RankingStory = {
  id: number;
  slug: string;
  avatar: string;
  name: string;
  author: string;
  creation_time: number;
  modification_time: number;
  status: string;
  owner: number;
  category: Category[];
  team: Team;
  enable: boolean;
  description: string;
  statistics: Statistics;
  avatar_uri: string;
  recommended: boolean;
  recommended_time: number;
  last_chapter: LastChapter | null;
  type: string;
};

export type RankingResponse = {
  count: number;
  next: number | null;
  previous: number | null;
  results: RankingStory[];
};
