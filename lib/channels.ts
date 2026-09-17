export type Channel = {
  name: string;
  handle: string;
  kind: string;
  tagline: string;
  description: string;
  url: string;
  avatarFallback: string;
};

export const channels: Channel[] = [
  {
    name: "ANANVAY IO",
    handle: "ananvayio",
    kind: "building · tech × hardware",
    tagline: "welcome to the digital damage center.",
    description:
      "Engineering student by pressure, creator by obsession. Founder & CEO of VOIKES Technologies — chaotic vlogs, late-night project builds, startup madness, and the messy side of making AI × hardware real.",
    url: "https://www.youtube.com/@ananvayio",
    avatarFallback:
      "https://yt3.googleusercontent.com/p1psdG8Ug0s8V9wl26j12NfHsy789A71EJkZ2zRADLzpUrZPpJQh3CD-XHUMH0HlWxAlvVt84A=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "AM AFTERHOURS",
    handle: "AM-Afterhours",
    kind: "gaming",
    tagline: "the channel that only exists after midnight.",
    description:
      "The gaming side of me. Long sessions, ranked grinds, collabs, and everything that happens after hours — no edits, just the good bits.",
    url: "https://www.youtube.com/@AM-Afterhours",
    avatarFallback:
      "https://yt3.googleusercontent.com/ytc/AIdro_lImVEFshLCzwKPwsKil_wI44W3fLO5VgHisdM_-Jtm5ZMsPSMXFTRot9-tSU3zW38Ftw=s900-c-k-c0x00ffffff-no-rj",
  },
];