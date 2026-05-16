export const platforms = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    tagline: 'Export every prompt and reply OpenAI has on you.',
    color: '#10A37F',
    url: 'https://chat.openai.com/',
    timeEstimate: '5 minutes + email wait',
    deliveredAs: '.zip with conversations.json + chat.html',
    steps: [
      'Sign in at chat.openai.com.',
      'Click your profile (bottom-left) and open "Settings".',
      'Open the "Data controls" tab.',
      'Click "Export data" → confirm with "Confirm export".',
      'Check your account email. OpenAI sends a download link, usually within minutes.',
      'Click the link in the email and download the .zip file. The link expires in 24 hours.',
    ],
    tips: [
      'The export includes every conversation, even ones you "deleted" but didn\'t purge.',
      'conversations.json is the machine-readable copy — use this with your own AI.',
    ],
  },
  {
    id: 'apple',
    name: 'Apple',
    tagline: 'Pull your entire iCloud life out of Cupertino.',
    color: '#A2AAAD',
    url: 'https://privacy.apple.com/',
    timeEstimate: '15 minutes + up to 7 days wait',
    deliveredAs: 'One or more .zip files (you choose the max size)',
    steps: [
      'Go to privacy.apple.com and sign in with your Apple ID.',
      'Click "Request a copy of your data".',
      'Pick the categories you want — iCloud Drive, Photos, Mail, Health, App Store, Apple Music, Maps, the works.',
      'Choose a maximum file size (1 GB to 25 GB).',
      'Click "Complete request". Apple confirms by email.',
      'When ready (Apple says up to 7 days; usually faster), you\'ll get an email with download links valid for 14 days.',
    ],
    tips: [
      'Pick the 25 GB chunk size unless you have a reason not to — fewer files to juggle.',
      'Health data is XML. Open it with any text editor or import into a CDA viewer.',
    ],
  },
  {
    id: 'google',
    name: 'Google',
    tagline: 'Liberate Gmail, Drive, YouTube, Search history — everything.',
    color: '#4285F4',
    url: 'https://takeout.google.com/',
    timeEstimate: '10 minutes + hours to days wait',
    deliveredAs: '.zip or .tgz (your pick), delivered by email or to your Drive',
    steps: [
      'Go to takeout.google.com while signed in.',
      'Click "Deselect all", then check only the products you actually want.',
      'For each product, click "All data included" to narrow it further (e.g. only specific Gmail labels).',
      'Scroll down and click "Next step".',
      'Pick a delivery method: email link, Drive, Dropbox, OneDrive, or Box.',
      'Pick frequency (one-time or every 2 months for a year), file type (.zip or .tgz), and max size.',
      'Click "Create export". You\'ll get an email when it\'s ready — could be minutes for small exports, days for large ones.',
    ],
    tips: [
      'YouTube and Photos are usually the biggest. Export them separately so a failure doesn\'t torch the whole job.',
      'Gmail comes out as .mbox — open it with Thunderbird, Apple Mail, or `mbox-to-json` to feed your own AI.',
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    tagline: 'Yank your data out of Facebook, Instagram, and Threads.',
    color: '#0866FF',
    url: 'https://accountscenter.meta.com/info_and_permissions/',
    timeEstimate: '10 minutes + hours to days wait',
    deliveredAs: '.zip with HTML or JSON (your pick)',
    steps: [
      'Open Accounts Center at accountscenter.meta.com.',
      'Pick "Your information and permissions" → "Download your information".',
      'Click "Download or transfer information".',
      'Choose the accounts (Facebook, Instagram, Threads) and profile to export.',
      'Pick "Some of your information" to filter, or "All available information" for everything.',
      'Choose "Download to device", set date range, format (JSON for machines, HTML for humans), and media quality.',
      'Click "Create files". Meta will email you when the export is ready.',
    ],
    tips: [
      'JSON is the format you want if you plan to feed this into your own AI.',
      'The export includes ad interest profiles and "off-Facebook activity" — worth reading even if you never use it.',
    ],
  },
];

export function getPlatformById(id) {
  return platforms.find((p) => p.id === id);
}
