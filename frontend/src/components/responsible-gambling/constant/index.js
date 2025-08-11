/* eslint-disable quotes */

export const TAB_CONTROLS = [
  // { label: 'Smart Gaming', value: 'getStart' },
  { label: 'Smart Gaming', value: 'smartGaming' },
  // { label: 'Recognise The Signs', value: 'collectSweeps' },
  { label: 'Recognise The Signs', value: 'recognisetheSigns' },

  // { label: 'Self-Assessment', value: 'sweepstackCash' },
  { label: 'Self-Assessment', value: 'selfAssesment' },

  // { label: 'General Questions', value: 'generalQuestions' },
  // { label: 'Account Details', value: 'accountDetails' },
  // { label: 'Self Exclusion', value: 'selfExclusion' },
  { label: 'Budget Calculator', value: 'budgetCalculator' },
  {
    label: 'Self Exclusion',
    value: 'selfExclusion',
  },
];

export const ResponsibleGaming_MAPPING = {
  en: {
    smartGaming: {
      title: 'Smart Gaming',
      description:
        'Dinero Sweeps is dedicated to providing a secure and enjoyable gaming environment for all players. Online gaming should remain an entertaining activity without negatively impacting other aspects of your life.',
      questions: [
        {
          question: 'Tips for Managing Your Gaming Habits',
          answer:
            'Ensure your gaming is balanced with other hobbies and activities',
        },
        {
          question: 'House Advantage/House Edge',
          answer:
            'Games typically have a house edge, which ensures that a percentage of the total amount played is returned to the house (in this case, Dinero Sweeps).',
        },
        {
          question: 'Independent Outcomes',
          answer:
            'Each game or spin is independent. Previous gameplay, whether in terms of duration or spending, does not influence the outcome.',
        },
        {
          question: 'Free Play',
          answer: 'No purchase is required to enter sweepstakes.',
        },
        {
          question: 'Age Requirement',
          answer:
            'Participants must be at least 18 years old to engage in gaming activities.',
        },
        {
          question: 'Responsible Gaming Tools',
          answer:
            'Dinero Sweeps provides several tools to help you manage your gaming activities effectively.',
        },
        {
          question: 'Self-Exclusion',
          answer:
            'Self-exclusion is a tool to suspend access to your account. This can be helpful if you believe you may develop a gaming problem or simply wish to take a longer break.',
        },
        {
          question: 'Self-Exclusion Application',
          answer:
            'Self-exclusion is a tool to suspend access to your account. This can be helpful if you believe you may develop a gaming problem or simply wish to take a longer break.',
        },
        {
          question: 'Account Closure',
          answer: 'Account Closure',
        },
        {
          question: 'Support Organizations',
          answer: 'Support Organizations',
        },
      ],
    },
    recognisetheSigns: {
      title: 'How Can My Gaming Activities Impact Me?',
      description:
        "It’s often easier to notice when someone else's gaming has become problematic, but it can be much harder to recognize it in ourselves. While financial issues are a common result of problematic gaming, the effects often extend far beyond that. Recognizing the signs of gaming dependency is crucial in addressing the problem before it escalates further.",
      questions: [
        {
          question: 'Is My Gaming Affecting My Mental Health?',
          answer:
            'Gaming addiction can severely impact relationships, making it harder to address the issue. Consider these points:',
        },
        {
          question: 'Is My Gaming Affecting My Finances?',
          answer:
            'One of the clearest signs that gaming has become problematic is when debt accumulates or money that should be used for essential needs is being spent on gaming.',
        },
        {
          question: 'Help Organizations',
          answer:
            'If your gaming has impacted your mental health, finances, or relationships, we encourage you to reach out to the following support organizations:',
        },
      ],
      list: [
        {
          point: '',
          subPoint: [],
        },
        {
          point: '',
          subPoint: [
            {
              option:
                'Gaming Addicts Anonymous (GAA): A fellowship for individuals recovering from the effects of excessive gaming.',
            },
            {
              option:
                'Financial Counseling Association of America (FCAA): An association offering financial counseling services and debt management plans.',
            },
            {
              option:
                'National Foundation for Credit Counseling (NFCC): A non-profit agency that provides financial counseling to help people overcome debt.',
            },
            {
              option:
                '*REMINDER: This self-assessment is meant to help you identify if you have or may be developing a problem. If you answered "yes" to one or more of these questions, it’s important to seek help.',
            },
          ],
        },
      ],
    },
    selfAssesment: {
      title: 'Self-Assessment',
      description:
        'Gaming can be a fun and entertaining activity for many people. However, for some, it may evolve into something more problematic, affecting different areas of their lives. Recognizing the signs of this shift is crucial to addressing the issue. This self-assessment tool is designed to help you evaluate your gaming behavior and determine if it might be causing harm in your life. Approach this assessment with honesty and openness to gain a clearer understanding of your habits.',
      questions: [
        {
          question: 'Ask yourself the following questions:',
        },
      ],
      list: [
        {
          point:
            'Does your gaming interfere with important responsibilities, such as work, school, chores, or projects?',
          subPoint: [],
        },
        {
          point:
            'Has your gaming impacted your academic performance or job due to the amount of time you spend playing?',
          subPoint: [],
        },
        {
          point:
            'Do you use gaming as a way to escape from personal problems or stress?',
          subPoint: [],
        },
        {
          point:
            'Have you missed deadlines or failed to complete tasks because of the time spent gaming?',
          subPoint: [],
        },
        {
          point: 'Have you ever borrowed money to fund your gaming activities?',
          subPoint: [],
        },
        {
          point:
            'Do you feel frustrated, angry, or upset when trying to cut back on your gaming?',
          subPoint: [],
        },
        {
          point:
            'Have you ever found yourself in financial trouble as a result of your gaming habits?',
          subPoint: [],
        },
        {
          point:
            'Do you spend more time gaming than you feel comfortable with?',
          subPoint: [],
        },
        {
          point:
            'Do you find yourself being dishonest about the amount of time you spend gaming?',
          subPoint: [],
        },
        {
          point:
            'Has gaming caused repeated or serious issues in your relationships with family or friends?',
          subPoint: [],
        },
        {
          point:
            "If you feel that your gaming has negatively impacted your wellbeing or that you've lost control over it, you can explore our self-exclusion options here. Alternatively, if you would like to take a break, you can find our timeout options here. If your gaming has impacted your mental health, finances, or relationships, we encourage you to reach out to the following support organizations:",
          subPoint: [],
        },
        {
          point:
            'Alternatively, if you would like to take a break, you can find our timeout options here. If your gaming has impacted your mental health, finances, or relationships, we encourage you to reach out to the following support organizations:',
          subPoint: [],
        },
        {
          point:
            'If your gaming has impacted your mental health, finances, or relationships, we encourage you to reach out to the following support organizations:',
          subPoint: [
            {
              option:
                'Gaming Addicts Anonymous (GAA): A fellowship for individuals recovering from the effects of excessive gaming.',
            },
            {
              option:
                'Financial Counseling Association of America (FCAA): An association offering financial counseling services and debt management plans.',
            },
            {
              option:
                'National Foundation for Credit Counseling (NFCC): A non-profit agency that provides financial counseling to help people overcome debt.',
            },
            {
              option:
                '*REMINDER: This self-assessment is meant to help you identify if you have or may be developing a problem. If you answered "yes" to one or more of these questions, it’s important to seek help.',
            },
          ],
        },
      ],
    },
    generalQuestions: {
      title: 'GENERAL QUESTIONS',
      description: '',
      questions: [
        {
          question: 'How are the spins calculated?',
          answer:
            'All of our spins are completely random and all results are based on provably fair model. We have no control over the wins and losses and you can check the spins result any time through the algorithm.',
        },
        {
          question: 'Can I have some Dinero SweepsSweepstake Cash or Game Coins?',
          answer:
            'We occasionally have freeplay or no purchase bonuses available. When we will send you an email letting you know all of the details. Be sure to check us out on social media as we may have special promotions there as well!',
        },
        {
          question: 'Are there any special rewards I can receive?',
          answer:
            'After creating your account the team at Dinero Sweeps wants you to enjoy your time as much as possible. We believe in continuous rewards through promotional deals including match play, freeplay, and other giveaways.',
        },
        {
          question: 'Where can I get promotions/giveaways?',
          answer:
            "We post all of our site-wide promotions on our social media! Make sure you follow us so you don't miss out! If you don't use social media then be sure to check your emails on a regular basis!",
        },
        {
          question:
            'I have referred other players, can I have some bonus points?',
          answer:
            'Sure, we will release our affiliate system soon. If you invite a friend and your friend starts playing, you can get a commission.',
        },
        {
          question: 'Can I use more than one account?',
          answer:
            'It is against our terms and conditions for an individual to have more than one account. If you do happen to have more than one please reach out to us via the online chat so we can resolve this. You will be unable to redeem your Dinero Sweeps if you have more than one account.',
        },
        {
          question: 'Can I delete/temporarily disable my account?',
          answer:
            'We take our responsible gaming practices very seriously. There are a few different options and you the player can pick from what you want to do. Option 1 is a timed disable. Simply provide a specific timeframe you would like to be disabled for and we will stop your account for that period of time. EG: 3 days, 1 week, 2 weeks etc. Option 2 is a request enable. This one means that we will disable your account until you are ready to come back on. Option 3 is to permanently disable your account. With this option we will disable your account and never reactivate it under any circumstances.',
        },
      ],
      list: [],
    },
    //
  },
};

export const en = 'en';
