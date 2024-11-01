import {
  fromDetails,
  initialWallUrl,
  initialWallUrlWithDetails,
  toDetails,
  toWallBaseUrl,
} from "./WallUrl";

describe("fromDetails", () => {
  describe("valid cases", () => {
    test("create a simple URL", () => {
      expect(fromDetails({
        wallIdentifier: "cats",
      })).toBe("https://my.walls.io/cats?embedwidth=auto");
    });

    test("create a URL from known params", () => {
      expect(fromDetails({
        wallIdentifier: "teaenthusiasts",
        showHeader: true,
        height: 142,
      })).toBe("https://my.walls.io/teaenthusiasts?show_header=1&embedwidth=auto&embedheight=142");
    });

    test("create a URL from unknown params", () => {
      expect(fromDetails({
        wallIdentifier: "teaenthusiasts",
        foobar: "baz",
      })).toBe("https://my.walls.io/teaenthusiasts?embedwidth=auto");
    });

    test("create a URL from known and unknown params", () => {
      expect(fromDetails({
        wallIdentifier: "cats",
        foo: "bar",
        showBackground: true,
      })).toBe("https://my.walls.io/cats?nobackground=0&embedwidth=auto");
    });

    test("override default embedwidth", () => {
      expect(fromDetails({
        wallIdentifier: "cats",
        showBackground: false,
        width: 900,
      })).toBe("https://my.walls.io/cats?nobackground=1&embedwidth=900");
    });

    test("disallow override of default embedwidth with empty value", () => {
      expect(fromDetails({
        wallIdentifier: "cats",
        width: "",
      })).toBe("https://my.walls.io/cats?embedwidth=auto");
    });
  });

  describe("invalid cases", () => {
    test("no identifier", () => {
      expect(fromDetails({
        height: 200,
      })).toBe(null);
    });

    test("empty object", () => {
      expect(fromDetails({})).toBe(null);
    });

    test("no input", () => {
      expect(fromDetails()).toBe(null);
    });

    test("null input", () => {
      expect(fromDetails(null)).toBe(null);
    });
  });
});

describe("toDetails", () => {
  describe("valid cases", () => {
    test("parse a simple URL", () => {
      expect(toDetails("https://my.walls.io/cats")).toEqual({
        wallIdentifier: "cats",
      });
    });

    test("parse a URL from the old domain", () => {
      expect(toDetails("https://walls.io/cats")).toEqual({
        wallIdentifier: "cats",
      });
    });

    test("parse a URL with known params", () => {
      expect(toDetails("https://my.walls.io/teaenthusiasts?show_header=1&embedwidth=auto&embedheight=142")).toEqual({
        wallIdentifier: "teaenthusiasts",
        height: "142",
        showHeader: true,
        width: "auto",
      });
    });

    test("parse an old URL with known params", () => {
      expect(toDetails("https://walls.io/teaenthusiasts?show_header=1&embedwidth=auto&embedheight=142")).toEqual({
        wallIdentifier: "teaenthusiasts",
        height: "142",
        showHeader: true,
        width: "auto",
      });
    });

    test("ignore empty params", () => {
      expect(toDetails("https://my.walls.io/cats?show_header=0&embedheight")).toEqual({
        wallIdentifier: "cats",
        height: null,
        showHeader: false,
      });
    });

    test("parse a URL with unknown params", () => {
      expect(toDetails("https://my.walls.io/teaenthusiasts?foobar=baz")).toEqual({
        wallIdentifier: "teaenthusiasts",
      });
    });

    test("parse a URL with known and unknown params", () => {
      expect(toDetails("https://my.walls.io/cats?nobackground=0&foo=bar")).toEqual({
        wallIdentifier: "cats",
        showBackground: true,
      });
    });
  });

  describe("invalid cases", () => {
    test("title_url too short", () => {
      expect(toDetails("https://my.walls.io/x?embedwidth=auto")).toEqual({});
    });

    test("title_url too short (with old domain)", () => {
      expect(toDetails("https://walls.io/x?embedwidth=auto")).toEqual({});
    });

    test("invalid host", () => {
      expect(toDetails("https://google.com/cats?embedwidth=auto")).toEqual({});
    });

    test("invalid walls.io host", () => {
      expect(toDetails("https://app.walls.io/cats?embedwidth=auto")).toEqual({});
    });

    test("empty string", () => {
      expect(toDetails("")).toEqual({});
    });

    test("no input", () => {
      expect(toDetails()).toEqual({});
    });

    test("null input", () => {
      expect(toDetails(null)).toEqual({});
    });
  });
});

describe("toWallBaseUrl", () => {
  describe("valid cases", () => {
    const baseUrl = "https://my.walls.io/cats?embedwidth=auto";

    test("already a base URL", () => {
      expect(toWallBaseUrl("https://my.walls.io/cats")).toBe(baseUrl);
    });

    test("base URL using the old domain", () => {
      expect(toWallBaseUrl("https://walls.io/cats")).toBe(baseUrl);
    });

    test("base URL with empty path", () => {
      expect(toWallBaseUrl("https://my.walls.io/cats/")).toBe(baseUrl);
    });

    test("URL with params", () => {
      const input = "https://my.walls.io/cats?foo=bar&embedwidth=400&embedheight=300&nobackground=1";
      expect(toWallBaseUrl(input)).toBe(baseUrl);
    });
  });

  describe("invalid cases", () => {
    test("invalid domain", () => {
      expect(toWallBaseUrl("https://google.com/cats")).toBe(null);
    });

    test("invalid walls.io domain", () => {
      expect(toWallBaseUrl("https://app.walls.io/cats")).toBe(null);
    });

    test("title_url too short", () => {
      expect(toWallBaseUrl("https://my.walls.io/a?embedheight=600")).toBe(null);
    });

    test("title_url too short (old domain)", () => {
      expect(toWallBaseUrl("https://walls.io/a?embedheight=600")).toBe(null);
    });

    test("empty title_url", () => {
      expect(toWallBaseUrl("https://my.walls.io")).toBe(null);
    });

    test("empty title_url (old domain)", () => {
      expect(toWallBaseUrl("https://walls.io")).toBe(null);
    });

    test("empty title_url with params", () => {
      expect(toWallBaseUrl("https://my.walls.io?embedwidth=100")).toBe(null);
    });

    test("empty title_url with params (old domain)", () => {
      expect(toWallBaseUrl("https://walls.io?embedwidth=100")).toBe(null);
    });

    test("empty input", () => {
      expect(toWallBaseUrl("")).toBe(null);
    });
  });
});

describe("initialWallUrlWithDetails", () => {
  test("known param", () => {
    expect(initialWallUrlWithDetails("cats", {
      height: 500,
    })).toBe("https://my.walls.io/cats?embedwidth=auto&embedheight=500");
  });

  test("unknown param", () => {
    expect(initialWallUrlWithDetails("cats", {
      foobar: 42,
    })).toBe("https://my.walls.io/cats?embedwidth=auto");
  });

  test("known and unknown params", () => {
    expect(initialWallUrlWithDetails("cats", {
      height: 600,
      foobar: "baz",
    })).toBe("https://my.walls.io/cats?embedwidth=auto&embedheight=600");
  });

  test("override of default width", () => {
    expect(initialWallUrlWithDetails("cats", {
      showHeader: true,
      width: 42,
    })).toBe("https://my.walls.io/cats?show_header=1&embedwidth=42");
  });
});

describe("initialWallUrl", () => {
  test("valid title_url", () => {
    expect(initialWallUrl("cats")).toBe("https://my.walls.io/cats?show_header=0&nobackground=0&embedwidth=auto&embedheight=600");
  });

  test("empty input", () => {
    expect(initialWallUrl("")).toBe(null);
  });
});
