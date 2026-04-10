export type WeatherData = {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
};

export type ForecastData = {
  list: Array<{
    dt: number;
    dt_txt?: string;
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
  }>;
};

export type WardrobeItem = {
  id?: number;
  name: string;
  category: string;
  color: string;
  tags: string;
  image_url?: string;
};

export type StylePreference = "Casual" | "Formal" | "Streetwear" | "Sporty" | "Minimalist";
export type Activity = "College" | "Office" | "Gym" | "Party" | "Travel" | "Outdoor sports";
