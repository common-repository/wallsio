
import {
  checkParsedUrl,
  fixDomain,
  getFirstPathPart,
  parseInput,
  parseText,
  parseUrl,
  replaceDomain,
} from "./InputParser";

describe("parseUrl", () => {
  test("parse a simple URL", () => {
    expect(parseUrl("https://my.walls.io/my-nice_Wall")).toBe("my-nice_Wall");
  });

  test("parse a simple URL (old format)", () => {
    expect(parseUrl("https://walls.io/my-nice_Wall")).toBe("my-nice_Wall");
  });

  test("walls.io URL which don't contain a wall identifier", () => {
    expect(parseUrl("my.walls.io")).toBe(null);
    expect(parseUrl("walls.io")).toBe(null);
    expect(parseUrl("www.walls.io")).toBe(null);
    expect(parseUrl("//walls.io")).toBe(null);
    expect(parseUrl("http://walls.io")).toBe(null);
    expect(parseUrl("https://walls.io")).toBe(null);
    expect(parseUrl("https://walls.io/")).toBe(null);
    expect(parseUrl("https://walls.io/?show_header=0")).toBe(null);
  });

  test("wall identifiers have at least 2 characters", () => {
    expect(parseUrl("https://my.walls.io/a")).toBe(null);
    expect(parseUrl("https://my.walls.io/a/blah")).toBe(null);
    expect(parseUrl("https://walls.io/a")).toBe(null);
  });

  test("parse non secure URL", () => {
    expect(parseUrl("http://my.walls.io/mywall")).toBe("mywall");
    expect(parseUrl("http://walls.io/mywall")).toBe("mywall");
  });

  test("parse a URL which starts with www", () => {
    expect(parseUrl("http://www.walls.io/mywall")).toBe("mywall");
  });

  test("parse with default protocol", () => {
    expect(parseUrl("//my.walls.io/mywall")).toBe("mywall");
    expect(parseUrl("//walls.io/mywall")).toBe("mywall");
  });

  test("parse a URL without a protocol", () => {
    expect(parseUrl("my.walls.io/mywall")).toBe("mywall");
    expect(parseUrl("walls.io/mywall")).toBe("mywall");
  });

  test("wall identifier contains characters which are disallowed for wall identifiers", () => {
    expect(parseUrl("my.walls.io/Straße")).toBe(null);
  });
});


describe("fixDomain", () => {
  test("Replace 'walls.io' and 'www.walls.io' with 'my.walls.io'", () => {
    expect(fixDomain("walls.io/my-nice_Wall")).toBe("my.walls.io/my-nice_Wall");
    expect(fixDomain("www.walls.io/my-nice_Wall")).toBe("my.walls.io/my-nice_Wall");
    expect(fixDomain("my.walls.io/my-nice_Wall")).toBe("my.walls.io/my-nice_Wall");

    expect(fixDomain("https://walls.io/my-nice_Wall?x=blah&y=aha")).toBe("https://my.walls.io/my-nice_Wall?x=blah&y=aha");
    expect(fixDomain("https://www.walls.io/my-nice_Wall")).toBe("https://my.walls.io/my-nice_Wall");
    expect(fixDomain("https://my.walls.io/my-nice_Wall")).toBe("https://my.walls.io/my-nice_Wall");

    expect(fixDomain("http://walls.io/my-nice_Wall?x=blah&y=aha")).toBe("http://my.walls.io/my-nice_Wall?x=blah&y=aha");
    expect(fixDomain("http://www.walls.io/my-nice_Wall")).toBe("http://my.walls.io/my-nice_Wall");
    expect(fixDomain("http://my.walls.io/my-nice_Wall")).toBe("http://my.walls.io/my-nice_Wall");

    expect(fixDomain("//walls.io/my-nice_Wall?x=blah&y=aha")).toBe("//my.walls.io/my-nice_Wall?x=blah&y=aha");
    expect(fixDomain("//www.walls.io/my-nice_Wall")).toBe("//my.walls.io/my-nice_Wall");
    expect(fixDomain("//my.walls.io/my-nice_Wall")).toBe("//my.walls.io/my-nice_Wall");
  });
});

describe("replaceDomain", () => {
  test("Replace a domain with another one", () => {
    expect(replaceDomain("walls.io", "my.walls.io", "walls.io/my-nice_Wall"));
    expect(replaceDomain("walls.io", "my.walls.io", "www.walls.io/my-nice_Wall"));
    expect(replaceDomain("walls.io", "my.walls.io", "my.walls.io/my-nice_Wall"));

    expect(replaceDomain("www.walls.io", "my.walls.io", "walls.io/my-nice_Wall"));
    expect(replaceDomain("www.walls.io", "my.walls.io", "www.walls.io/my-nice_Wall"));
    expect(replaceDomain("www.walls.io", "my.walls.io", "my.walls.io/my-nice_Wall"));

    expect(replaceDomain("walls.io", "my.walls.io", "https://walls.io/my-nice_Wall"));
    expect(replaceDomain("walls.io", "my.walls.io", "https://www.walls.io/my-nice_Wall"));
    expect(replaceDomain("walls.io", "my.walls.io", "https://my.walls.io/my-nice_Wall"));

    expect(replaceDomain("www.walls.io", "my.walls.io", "https://walls.io/my-nice_Wall"));
    expect(replaceDomain("www.walls.io", "my.walls.io", "https://www.walls.io/my-nice_Wall"));
    expect(replaceDomain("www.walls.io", "my.walls.io", "https://my.walls.io/my-nice_Wall"));
  });
});

describe("parseText", () => {
  describe("Don't match other text", () => {
    test("Random strings should not be mached", () => {
      expect(parseText("testinput")).toBe(null);
      expect(parseText("")).toBe(null);
      expect(parseText(" ")).toBe(null);
    });

    test("Random HTML should not be matched", () => {
      const str = "Hello World, <p>Blah</p><div>Here you go</div>";
      expect(parseText(str)).toBe(null);
    });

    test("Text which contains wall URLs should not be matched", () => {
      // Otherwise converting the string to a wall would lose the context.
      // If a user wants to add a wall (and not the URL), they will insert a wall without context.
      expect(parseText("Hello https://my.walls.io/mywall World")).toBe(null);
    });
  });

  describe("Parse wall URLs", () => {
    test("Full wall URLs should be matched", () => {
      expect(parseText("https://my.walls.io/mywall")).toBe("mywall");
      expect(parseText("https://walls.io/mywall")).toBe("mywall");
    });

    test("wall URL surrounded by whitespace should be matched", () => {
      expect(parseText("  my.walls.io/mywall  ")).toBe("mywall");
      expect(parseText("  walls.io/mywall  ")).toBe("mywall");
    });

    test("wall URL surrounded by crazy whitespaces should be matched", () => {
      expect(parseText("\n\tmy.walls.io/mywall\u00A0\t\n\r")).toBe("mywall");
      expect(parseText("\n\twalls.io/mywall\u00A0\t\n\r")).toBe("mywall");
    });
  });

  describe("Parse Iframe embeds", () => {
    test("Iframe embeds should be matched", () => {
      const str = '<iframe allowfullscreen src="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></iframe>';
      expect(parseText(str)).toBe("mywall");

      const oldStr = '<iframe allowfullscreen src="https://walls.io/mywall?nobackground=1&amp;show_header=0"></iframe>';
      expect(parseText(oldStr)).toBe("mywall");
    });

    test("Wrong domains should not be matched", () => {
      const str = '<iframe allowfullscreen src="https://youtube.com/mywall?nobackground=1&amp;show_header=0"></iframe>';
      expect(parseText(str)).toBe(null);
    });

    test("Other elements should not be matched", () => {
      const str = '<div src="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></div>';
      expect(parseText(str)).toBe(null);
    });

    test("Nested elements should not be matched", () => {
      const str = '<div><iframe src="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></iframe></div>';
      expect(parseText(str)).toBe(null);
    });
  });

  describe("Parse JavaScript embeds", () => {
    test("Javascript embeds should be matched", () => {
      const str = '<script src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></script>';
      expect(parseText(str)).toBe("mywall");
    });

    test("Wrong wallurl domains should not be matched", () => {
      const str = '<script src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://wrong.io/mywall?nobackground=1&amp;show_header=0"></script>';
      expect(parseText(str)).toBe(null);
    });

    test("Other elements should not be matched", () => {
      const str = '<div src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></div>';
      expect(parseText(str)).toBe(null);
    });

    test("Nested elements should not be matched", () => {
      const str = '<div><script src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></script></div>';
      expect(parseText(str)).toBe(null);
    });

    test("Wrong script domains should not be matched", () => {
      const str = '<script src="https://wrong.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></script>';
      expect(parseText(str)).toBe(null);
    });
  });

  describe("totally invalid input", () => {
    test("empty string", () => {
      const input = "";
      expect(parseText(input)).toBe(null);
    });

    test("no input at all", () => {
      expect(parseText()).toBe(null);
    });

    test("null as input", () => {
      expect(parseText(null)).toBe(null);
    });
  });
});

describe("parseInput", () => {
  describe("normal input", () => {
    test("user has entered normal strings", () => {
      expect(parseInput("a")).toBe("a");
      expect(parseInput("ab")).toBe("ab"); // shortest possible wall
    });

    test("user has typed in a wall identifier", () => {
      // We treat them like normal input, there's nothing we can simplify about them
      expect(parseInput("ab")).toBe("ab"); // shortest possible wall
      expect(parseInput("my_Nice-Wall")).toBe("my_Nice-Wall");
    });
  });

  describe("wall URLs", () => {
    test("user has entered a wall URL", () => {
      expect(parseInput("walls.io/cats")).toBe("cats");
      expect(parseInput("https://my.walls.io/cats")).toBe("cats");
      expect(parseInput("https://walls.io/cats")).toBe("cats");
    });

    test("user has entered a wall URL with query params", () => {
      expect(parseInput("walls.io/cats?foobar=baz")).toBe("cats");
      expect(parseInput("https://my.walls.io/cats?foo=42")).toBe("cats");
      expect(parseInput("https://walls.io/cats?foo=42")).toBe("cats");
    });

    test("looks like a wall URL but contains invalid characters", () => {
      expect(parseInput("my.walls.io/Straße")).toBe("my.walls.io/Straße");
      expect(parseInput("walls.io/Straße")).toBe("walls.io/Straße");
    });

    test("wall identifier is too short to identify a wall", () => {
      expect(parseInput("my.walls.io/a")).toBe("my.walls.io/a");
      expect(parseInput("walls.io/a")).toBe("walls.io/a");
    });

    test("wall identifier is too long to identify a wall", () => {
      const wallIdentifier = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567";
      expect(wallIdentifier).toHaveLength(127); // max length is 126 characters

      const input = `my.walls.io/${wallIdentifier}`;

      // input is unchanged because it's too long
      expect(parseInput(input)).toBe(input);
    });

    test("wall identifier has the max length to identify a wall", () => {
      const wallIdentifier = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456";
      expect(wallIdentifier).toHaveLength(126); // max length is 126 characters

      const input = `my.walls.io/${wallIdentifier}`;

      expect(parseInput(input)).toBe(wallIdentifier);
    });

    test("input contains leading and trailing whitespace", () => {
      expect(parseInput(` helloworld `)).toBe("helloworld");
      expect(parseInput(` https://my.walls.io/helloworld `)).toBe("helloworld");
      expect(parseInput(` https://walls.io/helloworld `)).toBe("helloworld");
    });
  });

  describe("Parse Iframe embeds", () => {
    test("Iframe embeds should be matched", () => {
      const str = '<iframe allowfullscreen src="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></iframe>';
      expect(parseInput(str)).toBe("mywall");
    });

    test("Wrong domains should not be matched", () => {
      const str = '<iframe allowfullscreen src="https://youtube.com/mywall?nobackground=1&amp;show_header=0"></iframe>';
      expect(parseInput(str)).toBe(str);
    });

    test("Other elements should not be matched", () => {
      const str = '<div src="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></div>';
      expect(parseInput(str)).toBe(str);
    });

    test("Nested elements should not be matched", () => {
      const str = '<div><iframe src="https://walls.io/mywall?nobackground=1&amp;show_header=0"></iframe></div>';
      expect(parseInput(str)).toBe(str);
    });
  });

  describe("Parse JavaScript embeds", () => {
    test("Javascript embeds should be matched", () => {
      const str = '<script src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></script>';
      expect(parseInput(str)).toBe("mywall");
    });

    test("Wrong wallurl domains should not be matched", () => {
      const str = '<script src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://wrong.io/mywall?nobackground=1&amp;show_header=0"></script>';
      expect(parseInput(str)).toBe(str);
    });

    test("Other elements should not be matched", () => {
      const str = '<div src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></div>';
      expect(parseInput(str)).toBe(str);
    });

    test("Nested elements should not be matched", () => {
      const str = '<div><script src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></script></div>';
      expect(parseInput(str)).toBe(str);
    });

    test("Wrong script domains should not be matched", () => {
      const str = '<script src="https://wrong.io/js/wallsio-widget-1.2.js" data-wallurl="https://my.walls.io/mywall?nobackground=1&amp;show_header=0"></script>';
      expect(parseInput(str)).toBe(str);
    });
  });

  describe("totally invalid input", () => {
    test("empty string", () => {
      const input = "";
      expect(parseInput(input)).toBe("");
    });

    test("no input at all", () => {
      expect(parseInput()).toBe("");
    });

    test("null as input", () => {
      expect(parseInput(null)).toBe("");
    });
  });
});

describe("checkParseUrl", () => {
  test("simple URL is matched", () => {
    const url = new URL("https://my.walls.io/my-simple_Wall");
    expect(checkParsedUrl(url)).toBe("my-simple_Wall");
  });

  test("old domain is not allowed here (the doamin has to be fixed beforehand)", () => {
    const url = new URL("https://walls.io/my-simple_Wall");
    expect(checkParsedUrl(url)).toBe(null);
  });

  test("too short wall identifier", () => {
    const url = new URL("https://my.walls.io/a");
    expect(checkParsedUrl(url)).toBe(null);
  });

  test("identifier is followed by other stuff", () => {
    const url = new URL("https://my.walls.io/mywall/something");
    expect(checkParsedUrl(url)).toBe("mywall");
  });

  test("invalid characters in wall URL", () => {
    const url = new URL("https://my.walls.io/Straße");
    expect(checkParsedUrl(url)).toBe(null);
  });

  test("search params are stripped", () => {
    const url = new URL("https://my.walls.io/mywall?one=1&two=2&one=11");
    expect(checkParsedUrl(url)).toBe("mywall");
  });
});

describe("getFirstPathPart", () => {
  test("get first path element", () => {
    expect(getFirstPathPart("/one/two/three")).toBe("one");
  });

  test("test sinlge slash", () => {
    expect(getFirstPathPart("/")).toBe("");
  });

  test("empty string", () => {
    expect(getFirstPathPart("")).toBe("");
  });

  test("without trailing slash", () => {
    expect(getFirstPathPart("hello/world")).toBe("hello");
    expect(getFirstPathPart("hello")).toBe("hello");
  });

  test("multiple slashes", () => {
    expect(getFirstPathPart("//")).toBe("");
    expect(getFirstPathPart("///")).toBe("");
    expect(getFirstPathPart("////")).toBe("");
  });
});
