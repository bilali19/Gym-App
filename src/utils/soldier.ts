import type { Exercise, Scheme } from '@/types'

export const TEMPOS: string[] = ['3 0 2', '2 2 2', '4 1 1', '5 3 1', '1 0 1', '3 2 1', '2 1 1']

export const SCHEMES: Record<string, Scheme> = {
  strength_power: {
    repRanges: [3, 8],
    ratio: [3, 2],
    rest: [120, 60]
  },
  growth_hypertrophy: {
    repRanges: [8, 15],
    ratio: [2, 3],
    rest: [90, 60]
  },
  cardiovascular_endurance: {
    repRanges: [12, 30],
    ratio: [2, 4],
    rest: [60, 45]
  }
}

export const WORKOUTS: Record<string, any> = {
  individual: ['biceps', 'triceps', 'chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'abs'],
  bro_split: {
    push: ['triceps', 'chest', 'shoulders'],
    pull: ['back', 'shoulders', 'biceps'],
    legs: ['glutes', 'calves', 'hamstrings', 'quads']
  },
  bodybuilder_split: {
    chest: ['chest'],
    back: ['back'],
    shoulders: ['shoulders'],
    legs: ['glutes', 'quads', 'hamstrings', 'calves'],
    arms: ['biceps', 'triceps'],
    abs: ['abs']
  },
  upper_lower: {
    upper: ['triceps', 'biceps', 'shoulders', 'chest', 'back'],
    lower: ['quads', 'calves', 'hamstrings', 'glutes']
  }
}

export const EXERCISES: Record<string, Omit<Exercise, 'name'>> = {
  barbell_bench_press: {
    type: 'compound',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    variants: {
      incline: 'With a bench inclined between 30 and 45 degrees, hold the bar directly above your chest.',
      flat: 'Perform this exercise on a horizontal bench.',
      decline: 'Perform this exercise on a bench inclined at a -15 degree angle, your head at the lower end of the bench. Try to hook your legs over the end of the higher end of the bench, so to prevent yourself from slipping.',
      underhand: 'Lying on a flat bench, grab the bar with a reversed underhand grip, so that you are now holding the barbell thumbs pointing outwards. Be sure to reduce the weight when performing this variation of the exercise.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Ensure your scapula are retracted when performing the bench press, arms 2 palm widths wider than shoulder width. Lower the bar with your elbows flared at a 45 degree angle from your torso, touching the bar down to your chest at your nipple line.',
    substitutes: ['pushups', 'dumbbell bench press', 'floor press'],
    videoId: 'rT7DgCr-3pg',
    videoTitle: 'Perfect Barbell Bench Press Form'
  },
  prayer_press: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      incline: 'Press your hands away from you at a 45 degree angle above horizontal.',
      horizontal: 'Press your hands away from you at a 45 degree angle from horizontal.',
      decline: 'Press your hands away from you at a -30 degree angle below horizontal.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Place a light, weighted plate between the palms of your hands (as if your were praying), and while keeping your scapula retracted, press your hands together while pushing the plate away from you.',
    substitutes: ['palm prayer press'],
    videoId: 'gJDQf2abqQc',
    videoTitle: 'Prayer Press Chest Exercise'
  },
  pec_dec: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      high: 'Place the seat height so that your hands meet in the same horizontal plane as your mouth/chin.',
      standard: 'Place the seat height so that your hands meet in the same horizontal plane as your nipple height',
      decline: 'Place the seat height as high as possible so that the hand holds are below nipple height while sitting.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Ensure your scapula is retracted and try to puff our your chest while performing this exercise. Make sure you bring the handles together so they touch, and the range of motion should be no more than 90 degrees either side.',
    substitutes: ['cable chest fly'],
    videoId: 'Z79LxdkVNkQ',
    videoTitle: 'Pec Deck Machine Exercise Form'
  },
  standing_dumbbell_incline_fly: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells', 'bands']
    },
    unit: 'reps',
    muscles: ['chest', 'shoulders'],
    description: 'Standing with a dumbbell in either hand, palms facing forwards and chest puffed out, raise one dumbbell up and across your body until your palm is facing the ceiling and your hand has crossed your body. Lower slowing and repeat on the other side.',
    substitutes: ['inclined cable fly'],
    videoId: 'QENKPHhQVi4',
    videoTitle: 'Standing Incline Dumbbell Fly'
  },
  standing_plate_raises: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['chest', 'shoulders'],
    description: 'Standing with a weighted plate gripped eitherside, start with the plate down infront of your hips, and then raise the plate up infront of you to shoulder height, pausing at that height for a moment, before lowering the weight back down. Puff your chest up towards the ceiling while performing this exercise.',
    substitutes: ['standing dumbbell inline fly'],
    videoId: 'qt89n2iD6v4',
    videoTitle: 'Plate Front Raise Exercise'
  },
  cable_fly: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    variants: {
      incline: 'To target your upper chest, ensure the cable fixing is low, close to the ground. Your hands will move from low at your sides, to high, up infront of your face.',
      horizontal: 'Ensure the cabling fixing is at approximately chest height while performing this exercise.',
      decline: 'Set the cable fixing to the highest setting, so your hands move from high to low (as they come together infront of you) throughout the motion.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'This exercise can be performed from high to low, or low to high. Using the handles and with your arms mostly straight, bring the two handles together in front of you, and then slowly release backwards.',
    substitutes: ['Inclined dumbbell fly'],
    videoId: 'taI4XduLpTk',
    videoTitle: 'Cable Fly Exercise Form'
  },
  pushup: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      incline: 'To perform the inline pushup, ensure your feet are atop of a slightly elevated surface, while your hands are on the ground.',
      military: 'Ensure your hands are in the same vertical plane as your chest and shoulders',
      decline: 'To perform a decline pushup, place your hands slightly further underneath you, so that you are leaning over your hands and they are closer towards the line of your waist, that your shoulders.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'In a plank position, with hands slightly further than shoulder width apart (and thumbs around nipple height), slowly lower your chest to the ground, keeping elbows flared to a 45 degree angle. Then press back up.',
    substitutes: ['pushups', 'dumbbell bench press', 'floor press'],
    videoId: 'IODxDxX7oi4',
    videoTitle: 'Perfect Push-Up Form'
  },
  dips: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['chest', 'triceps'],
    description: 'When in the dip position, ensure you are leaning forward over your hands and slowly lower your body until your elbows are parallel with the ground. Then press back up. Keep your elbow flare to a maximum of 45 degrees.',
    substitutes: ['Chair dip'],
    videoId: '2z8JmcrW-As',
    videoTitle: 'How to Do Dips Properly'
  },
  dumbbell_bench_press: {
    type: 'compound',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: ['dumbbell']
    },
    variants: {
      incline: 'Perform this exercise on a bench inclined to 30 degrees.',
      horizontal: 'Perform this exercise on a flat bench.',
      decline: 'Perform this exercise on a bench declined by around 15 degrees, with your head resting at the lower end.',
      neutral_grip_incline: 'Perform this exercise on a bench inclined to 30 degrees. Align the dumbbells so that they are parallel to one another, your thumbs able to point along the length of your body.',
      neutral_grip_horizontal: 'Perform this exercise on a flat bench. Align the dumbbells so that they are parallel to one another, your thumbs able to point along the length of your body.',
      neutral_grip_decline: 'Perform this exercise on a bench declined by around 15 degrees, with your head resting at the lower end. Align the dumbbells so that they are parallel to one another, your thumbs able to point along the length of your body.',
      rotating_incline: 'Perform this exercise on a bench inclined to 30 degrees. Begin the movement with the dumbbells up above your chest, thumbs pointing towards eachother, and as you lower them either side of your chest, rotate the dumbbells so that your thumbs rotate to point up your body in the direction of your head, making the dumbbells parallel to each other. As you press back up, rotate them back to the original position.',
      rotating_horizontal: 'Perform this exercise on a flat bench. Begin the movement with the dumbbells up above your chest, thumbs pointing towards eachother, and as you lower them either side of your chest, rotate the dumbbells so that your thumbs rotate to point up your body in the direction of your head, making the dumbbells parallel to each other. As you press back up, rotate them back to the original position.',
      rotating_decline: 'Perform this exercise on a bench declined by around 15 degrees, with your head resting at the lower end. Begin the movement with the dumbbells up above your chest, thumbs pointing towards eachother, and as you lower them either side of your chest, rotate the dumbbells so that your thumbs rotate to point up your body in the direction of your head, making the dumbbells parallel to each other. As you press back up, rotate them back to the original position.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'With your scapula retracted, hold the dumbbells directly above your chest with your hands slightly wider than shoulder width apart. Lower the dumbbells, keeping elbows to a maximum 45 degree flare, until the your thumbs can touch your nipples/or are at the same height as your nipples, keeping your elbows flared at 45 degrees from your torso. Then press back up.',
    substitutes: ['pushup', 'bench press'],
    videoId: 'QsYre__-aro',
    videoTitle: 'Dumbbell Bench Press Form'
  },
  landmine_press: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      unilateral: 'Stand with the end of a tbar in one hand with your thumb near to your shoulder and your body at a 45 degree to the plane of the bar. Press the bar up and across your chest until your arm is extended and lower back down.',
      two_handed: 'Hold the end of the barbell with both hands, the barbell pointing directly away from your body, and press the barbell forwards and up until your hands are straight, then slowly lower it back towards your body.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Pin the end of a barbell into a ball-joint restraint or corner in the ground. Load any weight on the opposite end of the barbell. Standing behind the loaded end of the barbell, lift the one end so it starts off at chest height.',
    substitutes: ['prayer press'],
    videoId: 'mVvCUj2Qr2g',
    videoTitle: 'Landmine Press Exercise'
  },
  chest_press: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      high: 'Place the seat height so that your hands move in the same horizontal plane as your mouth/chin.',
      standard: 'Place the seat height so that your hands move in the same horizontal plane as your nipple height',
      decline: 'Place the seat height as high as possible so that the hand holds are below nipple height while sitting.',
      unilateral: 'Adjust the seat so the handles are approximately mid-chest level. Turn your torso 30 to 45 degrees towards the side you are about to press with. Press the handle across your body. Repeat on both sides.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Begin with your chest puffed and your scapula down and retracted. Press the handles out until your arms are straight. Then slow release backwards.',
    substitutes: ['bench press', 'pushup'],
    videoId: '7kmiGZPbJ5I',
    videoTitle: 'Chest Press Machine Form'
  },
  smith_machine_press: {
    type: 'compound',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      incline: 'With a bench inclined between 30 and 45 degrees, hold the bar directly above your chest.',
      flat: 'Perform this exercise on a horizontal bench.',
      decline: 'Perform this exercise on a bench inclined at a -15 degree angle, your head at the lower end of the bench. Try to hook your legs over the end of the higher end of the bench, so to prevent yourself from slipping.',
      underhand: 'Lying on a flat bench, grab the bar with a reversed underhand grip, so that you are now holding the barbell thumbs pointing outwards. Be sure to reduce the weight when performing this variation of the exercise.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Lying under a smith machine, ensure that the bar is aligned with your nipple height when it contacts your body. Keep elbows flared to a maximum of 45 degrees from your torso, hands slightly wider than shoulder width.',
    substitutes: ['bench press', 'pushup', 'dumbbell press'],
    videoId: 'P7duPCuGQHw',
    videoTitle: 'Smith Machine Bench Press'
  },
  unilateral_cable_press: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    variants: {
      incline: 'To target your upper chest, ensure the cable fixing is low, close to the ground. Your hand will move from low at your side, to high, up infront of your face. Use an underhand grip for this movement.',
      horizontal: 'Ensure the cabling fixing is at approximately chest height while performing this exercise. Hold the cable in a neutral or overhand grip.',
      decline: 'Set the cable fixing to the highest setting, so your hand moves from high to low throughout the motion.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Align your body at a 30 to 45 degree plane to the cable. Press the cable handle across your body until your elbow is straight and slowly release backwards. Ensure elbows are tucked during the exercise.',
    substitutes: ['unilateral chest press'],
    videoId: '5qyReEcISSc',
    videoTitle: 'Single Arm Cable Chest Press'
  },
  cable_crossover_press: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    variants: {
      incline: 'To target your upper chest, ensure the cable fixing is low, close to the ground. Your hands will move from low at your sides, to high, up infront of your face.',
      horizontal: 'Ensure the cabling fixing is at approximately chest height while performing this exercise.',
      decline: 'Set the cable fixing to the highest setting, so your hands move from high to low (as they come together infront of you) throughout the motion.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'As if you were doing a pushup or bench press, press the handles together and then crossed over in front of you, alternating the crossover of your hands with each rep.',
    substitutes: ['cable fly', 'unilateral chest press'],
    videoId: 'PFPaBJ8BUW4',
    videoTitle: 'Cable Crossover Exercise'
  },
  scapula_pushup: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'While in a plank or kneeling plank position, with your hands aligned at approximately eye height on the ground, press yourself away from the ground. Then allow your body to come back down to the ground, keeping your elbows straight and the inside of your elbow facing forward at all times.',
    substitutes: ['pushup'],
    videoId: 'p4OMlJRZpMY',
    videoTitle: 'Scapular Push-Up'
  },
  dumbbell_chest_fly: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    variants: {
      incline: 'With a bench inclined between 30 and 45 degrees, hold the dumbbells directly above your chest.',
      flat: 'Perform this exercise on a horizontal bench.',
      decline: 'Perform this exercise on a bench inclined at a -15 degree angle, your head at the lower end of the bench. Try to hook your legs over the end of the higher end of the bench, so to prevent yourself from slipping.'
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Holding a dumbbell in each hand directly above your chest, slowly lower the dumbbells to either side of your body while keeping your arms mostly straight, palms to the ceiling. Ensure the weights do not drop lowering than the height of your body.',
    substitutes: ['cable fly'],
    videoId: 'eozdVDA78K0',
    videoTitle: 'Dumbbell Chest Fly Form'
  },
  dumbbell_floor_press: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Lying on your back with your scapula retracted, and the dumbbells starting over your chest, lower each side back down with elbows flared to a 45 degree angle until your elbows touch the ground. Then press back up.',
    substitutes: ['dumbbell bench press'],
    videoId: 'uUGDRwge4F8',
    videoTitle: 'Dumbbell Floor Press'
  },
  barbell_floor_press: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['chest'],
    description: 'Lying with your scapula retracted, and the barbell starting over your chest, lower the barbell down towards nipple level, elbows flared to a 45 degree angle until your elbows touch the ground. Then press back up.',
    substitutes: ['barbell bench press'],
    videoId: 'bxCkwgdl2x4',
    videoTitle: 'Barbell Floor Press'
  },
  dumbbell_pullover: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['chest', 'back'],
    description: 'Lying holding a single dumbbell as if it were a goblet directly above your chest, slowly track the dumbbell back over your head, keeping your elbows tucked. Track back as far as comfortable behind your head, and then return to the starting position.',
    substitutes: ['Inclined dumbbell fly'],
    videoId: 'FK9kDYB2bCU',
    videoTitle: 'Dumbbell Pullover Exercise'
  },
  pullup: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing towards you.',
      neutral_grip: 'Perform this movement with a neutral grip, palms facing each other.',
      overhand: 'Perform this movement with a pronated grip, palms facing away from you.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Hands approximately shoulder width or slightly wider apart, start by retracting your scapula down and back, and then pull your body up until your chin is above bar height. Then return to a dead hang. Use an assisted pullup machine if required.',
    substitutes: ['lat pulldown'],
    videoId: 'eGo4IYlbE5g',
    videoTitle: 'Perfect Pull-Up Form'
  },
  lat_pulldown: {
    type: 'compound',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing towards you.',
      neutral_grip: 'Perform this movement with a neutral grip, palms facing each other.',
      overhand: 'Perform this movement with a pronated grip, palms facing away from you.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Hands approximately shoulder width or slightly wider apart, start by retracting your scapula down and back, and then pull the bar down until it touches your chest. Then return to a dead hang position.',
    substitutes: ['pullup', 'kneeling lat pushdown'],
    videoId: 'CAwf7n6Luuc',
    videoTitle: 'Lat Pulldown Form'
  },
  straight_arm_pushdown: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Begin with the bar approximately eye level and your arms extended mostly straight out in front of you, press the bar down (maintaining straight arms) until your hands or the bar touches your lower mid-section. Press your chest out and bring your hips through/between your arms (thrust). Release back to origin.',
    substitutes: ['pullup', 'kneeling lat pulldown'],
    videoId: '9-d6zKRk3p8',
    videoTitle: 'Straight Arm Pulldown'
  },
  kneeling_lat_pulldown: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing towards you.',
      neutral_grip: 'Perform this movement with a neutral grip, palms facing each other.',
      overhand: 'Perform this movement with a pronated grip, palms facing away from you.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Hands approximately shoulder width or slightly wider apart, start by retracting your scapula down and back, and then pull the bar down until it touches your chest. Ensure your look at the ceiling throughout the duration of the movement. Then return to a dead hang position.',
    substitutes: ['pullup', 'kneeling lat pushdown'],
    videoId: 'PUF1WLB6IgE',
    videoTitle: 'Kneeling Cable Lat Pulldown'
  },
  one_arm_pulldown: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Seated in the lat pulldown machine, begin by retracting your shoulder and scapula down and backwards. Then pull the handle down until your thumb can touch your shoulder. Repeat on both sides.',
    substitutes: ['pullup', 'kneeling lat pushdown'],
    videoId: 'kIDSeWoXeJE',
    videoTitle: 'Single Arm Lat Pulldown'
  },
  barbell_bentover_row: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing away from your feet.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards your feet.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Begin standing, with your hands slightly wider than shoulder width apart holding the bar. With a slight bend in your knees, hinge at your hips until your torso is angled 45 degrees forward. Imagine pulling your elbows back behind you to complete the row.',
    substitutes: ['seated row', 'dumbbell row'],
    videoId: 'FWJR5Ve8bnQ',
    videoTitle: 'Barbell Row Form'
  },
  dumbbell_bentover_row: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbell']
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing away from your feet.',
      neutral_grip: 'Perform this movement with a neutral grip, palms facing each other.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards your feet.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Begin standing, with your hands either side of your body holding the dumbbells. With a slight bend in your knees, hinge at your hips until your torso is angled 45 degrees forward. Imagine pulling your elbows back behind you to complete the row.',
    substitutes: ['seated row', 'dumbbell row'],
    videoId: 'roCP6wCXPqo',
    videoTitle: 'Dumbbell Bent Over Row'
  },
  pendlay_row: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbells']
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing away from your feet.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards your feet.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Begin with the bar on the ground, with your hands slightly wider than shoulder width apart. Hold your core tight, and pull your elbows back behind you until the bar touches your mid-chest. Slowly release back down to the ground and then repeat.',
    substitutes: ['seated row', 'barbell row'],
    videoId: 'h4xWgpJZ_Rg',
    videoTitle: 'Pendlay Row Exercise'
  },
  bodyweight_row: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing away from your feet.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards your feet.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Find a bar or table at approximately chest to weight height, and hang underneath it with your legs extending out underneath the support. Row your chest to the bar, and slowly lower yourself back down. It\'s preferable that your body remain rigid and straight during the execution of the exercise.',
    substitutes: ['seated row', 'barbell row'],
    videoId: '1PXZR-Tp4Ec',
    videoTitle: 'Bodyweight Row (Inverted Row)'
  },
  tbar_row: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'With the bar between your legs, your legs slightly bent, and with your torso hinged forward at the hips by approximately 45 degrees, row your elbows backwards until the weights touch your chest. Sit your bum back a bit to counter-balance the weight during this exercise.',
    substitutes: ['seated row', 'dumbbell row'],
    videoId: 'j3Igk5nyZE4',
    videoTitle: 'T-Bar Row Exercise'
  },
  seated_row: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing towards the ceiling.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards the ground.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'With your back vertical, row your elbows back and imagine pulling your hands to your hips on either side of your body. Ensure to minimise torso and hip hinging during the movement. Row low to grow.',
    substitutes: ['barbell row', 'dumbbell row'],
    videoId: 'xQNrFHEMhI4',
    videoTitle: 'Seated Cable Row Form'
  },
  unilateral_seated_row: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing the ceiling.',
      neutral_grip: 'Perform this movement with a neutral grip, palms facing towards your body.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards the ground.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'With the handle attachment, row your elbow back and pull your hand and the handle to your hip, and then release forwards.',
    substitutes: ['seated row', 'dumbbell row'],
    videoId: 'OgZiN-FqKQo',
    videoTitle: 'Single Arm Cable Row'
  },
  cable_row: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing towards the ceiling.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards the ground.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'With the cable at any height, bend your knees and lean back against the weights. Maintain your body in a stationary position, and row your elbows back, keeping your forearms neutral to the movement. Hold your core strong and tight.',
    substitutes: ['seated row', 'tbar row'],
    videoId: 'UCXxvVItLoM',
    videoTitle: 'Cable Row Exercise'
  },
  unilaterial_dumbbell_row: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Leaning forward at a 45 degree angle, with your weight supported through one arm pressing on a study surface, hang the dumbbell from your other arm. Ensure the leg on the same side as your supporting arm is forward. Row your elbow back and your hand to your hip. Repeat on both sides.',
    substitutes: ['unilateral seated row', 'dumbbell row'],
    videoId: 'pYcpY20QaE8',
    videoTitle: 'Single Arm Dumbbell Row'
  },
  chest_supported_dumbbell_row: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'With your chest supported on a bench angled to a 30 to 45 degree incline, hand your arms either side with dumbbells in each. Row your elbows back with your hands on a trajectory towards your lower waist. Slowly release the weights back forward.',
    substitutes: ['seated row', 'barbell row'],
    videoId: '6TSP1TRMUzs',
    videoTitle: 'Chest Supported Dumbbell Row'
  },
  machine_row: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing the ceiling.',
      neutral_grip: 'Perform this movement with a neutral grip, palms facing towards your body.',
      overhand: 'Perform this movement with a pronated grip, palms facing towards the ground.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Adjust the seat height so your hands retract back to a lower torso height. Row your elbows back.',
    substitutes: ['seated row', 'dumbbell row'],
    videoId: 'Pq6LC2URbGA',
    videoTitle: 'Machine Row Exercise'
  },
  machine_lat_pulldown: {
    type: 'compound',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing towards you.',
      neutral_grip: 'Perform this movement with a neutral grip, palms facing each other.',
      overhand: 'Perform this movement with a pronated grip, palms facing away from you.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Ensure you look at the ceiling while performing this exercise. Begin by retracting your scapula down and back, and then pull the machine bar down until your thumbs can touch your chest.',
    substitutes: ['lat pulldown', 'pullup'],
    videoId: 'CAwf7n6Luuc',
    videoTitle: 'Machine Lat Pulldown'
  },
  smith_machine_row: {
    type: 'compound',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      underhand: 'Perform this movement with a supinated grip, palms facing towards forwards.',
      overhand: 'Perform this movement with a pronated grip, palms facing backwards.'
    },
    unit: 'reps',
    muscles: ['back'],
    description: 'Begin standing, with your hands slightly wider than shoulder width apart holding the bar. With a slight bend in your knees, hinge at your hips until your torso is angled 45 degrees forward. Imagine pulling your elbows back behind you to complete the row.',
    substitutes: ['seated row', 'dumbbell row'],
    videoId: 'qFHNhiANr8c',
    videoTitle: 'Smith Machine Bent Over Row'
  },
  seated_dumbbell_overhead_press: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'With dumbbells in each hand, begin with the weights in-line with your ears and press them directly up above your head. Lower down until until your thumbs can touch your ears. Puff your chest out during this exercise.',
    substitutes: ['barbell overhead press', 'arnold press'],
    videoId: 'qEwKCR5JCog',
    videoTitle: 'Seated Dumbbell Shoulder Press'
  },
  barbell_overhead_press: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Standing with the bar starting at chin height and hands slightly wider than shoulder width, press the bar up and as it moves above head height, press your head forward between your arms. Squeeze your bum throughout the duration of the exercise.',
    substitutes: ['barbell overhead press', 'arnold press'],
    videoId: '2yjwXTZQDDI',
    videoTitle: 'Standing Barbell Overhead Press'
  },
  dumbbell_lateral_raise: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'With dumbbells in each hand, pretend your a bird trying to flap your arms, and raise the weights up either side of your body. Ensure your elbows are always at a higher height than the weights and your wrists. Slowly lower down to each side.',
    substitutes: ['unilateral cable raise', 'face pulls'],
    videoId: '3VcKaXpzqRo',
    videoTitle: 'Dumbbell Lateral Raise Form'
  },
  dumbbell_front_raise: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'With dumbbells in each hand down by your side, one at a time, raise the dumbbell out infront of you until it is at eye height, keeping your arm straight. Then slowly lower back down and repeat on the other side.',
    substitutes: ['unilateral cable raise', 'face pulls', 'cable_rope_front_raise'],
    videoId: 'qykGEO_PH_Q',
    videoTitle: 'Dumbbell Front Raise Exercise'
  },
  cable_rope_front_raise: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'With a rope handle in each hand (the cable pinned as low as possible and the cable itself, between your legs), raise the rope handles out infront of you until it is at eye height, keeping your arms straight. Then slowly lower back down.',
    substitutes: ['dumbbell front raise', 'face pulls'],
    videoId: 'DnKN2DqBhNY',
    videoTitle: 'Cable Rope Front Raise'
  },
  unilateral_cable_raise: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'With the cable on the lowest adjustment, hold the vertical bar with one hand and lean out from the cable machine by approximately 30 degrees. Hold the handle in the other hand, and raise the handle (leading with your elbow) up to shoulder height.',
    substitutes: ['dumbbell lateral raise', 'face pulls'],
    videoId: 'FPtsR8sLM6s',
    videoTitle: 'Single Arm Cable Lateral Raise'
  },
  cable_rope_face_pulls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Using the rope cable attachment, adjust the cable height so the pulley is just above head height. Hold the handles with your thumbs at the end of the rope, pointing towards you. Pull the rope towards your forehead, with your hands approximately ear height and your thumbs pointing behind you.',
    substitutes: ['unilateral cable raise', 'cable push aparts'],
    videoId: 'rep-qVOkqgk',
    videoTitle: 'Cable Face Pull Exercise'
  },
  cable_push_aparts: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'For this exercise, grip the carribena/handles so that your pinky fingers are facing backwards. Then imagine you\'re walking through a forest full of vines and spread those bad boys apart. The cable should be pinned just above head height.',
    substitutes: ['unilateral cable raise', 'cable rope face pulls'],
    videoId: 'BPCQPyqfSBE',
    videoTitle: 'Cable Push Aparts Exercise'
  },
  bentover_dumbbell_push_aparts: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Sitting bent forwards, head to knees, holding light dumbbells in either hand dead hanging down either side of your legs, raise them out to either side, pinkies leading the movement until they are in the same vertical plane as your shoulders and your thumbs are pointing straight downwards.',
    substitutes: ['unilateral cable raise', 'cable rope face pulls'],
    videoId: 'lLRr7G0MFdE',
    videoTitle: 'Bent Over Reverse Fly'
  },
  chest_supported_dumbbell_face_pulls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Lying on a 30 to 45 degree inclined bench with dumbbells in either hand, pull the dumbbells to either side of your ears, leading the motion with your elbows.',
    substitutes: ['unilateral cable raise', 'cable push aparts'],
    videoId: 'B6iYMHJjX_I',
    videoTitle: 'Chest Supported Reverse Fly'
  },
  chest_supported_barbell_face_pulls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Lying on a 30 to 45 degree inclined bench with a barbell gripped twice shoulder width, pull your thumbs back until they are in-line with your ears, leading the motion with your elbows.',
    substitutes: ['dumbbell face pulls', 'cable push aparts'],
    videoId: 'V8dZ3pyiCBo',
    videoTitle: 'Incline Barbell Row'
  },
  arnold_dumbbell_press: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Seated on a bench with a back rest, hold the dumbbells in-front of you at eye height, palms facing your face. Keeping the dumbbells at their current height, open your shoulders and move your elbows to either side until the dumbbells are next to your ears, your palms facing forwards, and then press them up overhead.',
    substitutes: ['barbell overhead press', 'dumbbell overhead press'],
    videoId: '6Z15_WdXmVw',
    videoTitle: 'Arnold Press Exercise'
  },
  lyings_ys: {
    type: 'accessory',
    meta: {
      environment: 'home',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Lying face down on the ground, extend your arms up above your head so your elbows are tucked up against your ears, and your thumbs pointing to the ceiling and your palms to each other. Now try to raise your hands and arms off the ground, pulling your thumbs back as far as you can and your scapula together while maintaining the same shape.',
    substitutes: ['face pulls'],
    videoId: '1DDHW2QxJrI',
    videoTitle: 'Y-Raises Exercise'
  },
  lying_ts: {
    type: 'accessory',
    meta: {
      environment: 'home',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Lying face down on the ground, extend your arms out to either side of your body, pointing directly away from yourself so your elbows and hands are in plane/level with your shoulders. Now while keeping your elbows and hands in the same location, rotate your hands so that your palms point upwards/above your head and your thumbs point to the ceiling. Now try to raise your hands and arms off the ground, pulling your thumbs back as far as you can and your scapula together while maintaining the same shape.',
    substitutes: ['supermans'],
    videoId: '0Sh2VRKJg8s',
    videoTitle: 'T-Raises Exercise'
  },
  lying_ws: {
    type: 'accessory',
    meta: {
      environment: 'home',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Lying face down on the ground, extend your arms out to either side of your body, pointing directly away from yourself so your elbows and hands are in plane/level with your shoulders. Now while keeping your elbows in the same location, bend them so that your fingers point directly upwards and so your elbow makes a 90 degree bend. Now position your hands so that your palms face your head, your fingers forwards/above your head, and your thumbs to the ceiling behind you. Now try to raise your hands and arms off the ground, pulling your thumbs back as far as you can and your scapula together while maintaining the same shape.',
    substitutes: ['plank side stars'],
    videoId: 'Y-6iu-TI1Ms',
    videoTitle: 'W-Raises Exercise'
  },
  plank_side_stars: {
    type: 'accessory',
    meta: {
      environment: 'home',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['shoulders'],
    description: 'Seated on a bench with a back rest, hold the dumbbells in-front of you at eye height, palms facing your face. Keeping the dumbbells at their current height, open your shoulders and move your elbows to either side until the dumbbells are next to your ears, your palms facing forwards, and then press them up overhead.',
    substitutes: ['lying ts'],
    videoId: 'aWL1QnLl0JU',
    videoTitle: 'Side Plank Star'
  },
  back_squats: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'Stand with your feet slightly wider than shoulder width, toes facing 15 degrees out from forward, slowly lower your body down until your thighs are parallel with the ground. Ensure your core is tight and your knees track in the direction of your toes. Rest the bar on the backs of your shoulders, behind your head.',
    substitutes: ['front squats', 'legpress'],
    videoId: 'SW_C1A-rejs',
    videoTitle: 'How to Back Squat'
  },
  bodyweight_squat: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'Stand with your feet slightly wider than shoulder width, toes facing 15 degrees out from forward, slowly lower your body down until your thighs are parallel with the ground. Ensure your core is tight and your knees track in the direction of your toes.',
    substitutes: ['front squats', 'legpress'],
    videoId: 'YaXPRqUwItQ',
    videoTitle: 'Bodyweight Squat Form'
  },
  front_squats: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'Stand with your feet slightly wider than shoulder width, toes facing 15 degrees out from forward, slowly lower your body down until your thighs are parallel with the ground. Ensure your core is tight and your knees track in the direction of your toes. Hold the bar on your shoulders, crossing your arms in-front of you (elbows above the bar).',
    substitutes: ['back squats', 'legpress'],
    videoId: 'uYumuL_G_V0',
    videoTitle: 'Front Squat Exercise'
  },
  goblet_squats: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'Elevate the heels of your feet on a plate approximate 2in or 5cm above thick. Keep your feet slightly narrower than shoulder width, and holding the dumbbell like a goblet at shoulder height, squat down, keeping your back as erect as possible.',
    substitutes: ['front squats', 'legpress'],
    videoId: 'MeIiIdhvXT4',
    videoTitle: 'Goblet Squat Exercise'
  },
  box_squats: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'With a barbell on your shoulders, bodyweight, or holding a dumbbell, situate yourself standing infront of, and facing away from, a box or chair or simular elevated surface. Position your feet shoulder width apart, and slow squat down, as if sitting back to sit down on the chair. Only lightly let your bum touch the chair, before standing back up.',
    substitutes: ['front squats', 'legpress'],
    videoId: 'Yk_YntQg_n8',
    videoTitle: 'Box Squat Exercise'
  },
  bulgarian_split_squats: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['quads', 'glutes'],
    description: 'Body weight or with dumbbells in each hand, lunge forward, elevating your rear leg up approximately 20 to 30cm, 1ft, above the ground. Keep your weight over your front leg, and lunge your body down until your front thigh is parallel with the ground.',
    substitutes: ['lunges', 'legpress'],
    videoId: '2C-uNgKwPLE',
    videoTitle: 'Bulgarian Split Squat'
  },
  lunges: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['quads', 'glutes'],
    description: 'Continuously lunge forward, slowly dropping your rear knee to touch the ground with each subsequent lunge. Ensure your body weight stays predominantly over your front leg.',
    substitutes: ['front squats', 'bulgarian split squats'],
    videoId: 'QOVaHwm-Q6U',
    videoTitle: 'Walking Lunges Exercise'
  },
  legpress: {
    type: 'compound',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      wide_stance: 'Place your feet a fair bit wider than shoulder width apart and vertically/centrally on the face of feet placement area.',
      neutral_stance: 'Place your feet shoulder width apart and vertically/centrally on the face of feet placement area.',
      narrow_stance: 'Place your feet 10cm/3in apart and vertically/centrally on the face of feet placement area.'
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'Slowly lower the weight down until your knees are at a 90 degree angle. Then push the weight back up, ensuring not to lock-out your legs at the top.',
    substitutes: ['front squats', 'back squats'],
    videoId: 'yZmx_Ac3880',
    videoTitle: 'Leg Press Machine Exercise'
  },
  quad_extension: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'On a quad extension machine, straighten your legs against the resistance of the machine. Face your toes in different directions to preferencially engage different parts of your quad muscles.',
    substitutes: ['goblet squats', 'legpress'],
    videoId: 'YyvSfVjQeL0',
    videoTitle: 'Leg Extension Machine'
  },
  step_ups: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['quads', 'glutes'],
    description: 'Without jumping, step up onto an evelated surface. They key is to slowly lower yourself back down on one leg without falling.',
    substitutes: ['lunges', 'front squats'],
    videoId: 'dQqApCGd5Ss',
    videoTitle: 'Step-Up Exercise'
  },
  wall_sits: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['quads'],
    description: 'With your back against a wall, and your knees making an angle of approximately 90 degrees, hold the wall sit as long as possible, without sinking down to the ground or holding yourself with your arms.',
    substitutes: ['front squats', 'goblet squats'],
    videoId: 'y-wV4Venusw',
    videoTitle: 'Wall Sit Exercise'
  },
  romanian_deadlifts: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      wide_stance: 'Place your feet one and half times as wide as shoulder width.',
      neutral_stance: 'Place your feet shoulderwidth distance apart.',
      narrow_stance: 'Place your feet right besides eachother so that they are touching.'
    },
    unit: 'reps',
    muscles: ['hamstrings'],
    description: 'Stand holding a bar or dumbbells hanging at your waist, hands shoulder width apart. With a slight bend in your knees, you want to hinge at your hips, slightly sitting back whilst tilting your torso forward. Keeping your back straight, run the barbell/dumbbells back down the length of your legs (as if touching).',
    substitutes: ['dumbbell rdls'],
    videoId: 'jEy_czb3RKA',
    videoTitle: 'Romanian Deadlift Form'
  },
  hamstring_back_extensions: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['hamstrings', 'glutes'],
    description: 'On the back extension machine, lock your feet in place and while lowering your torso down over the front of the machine, resist the motion by trying to curl your heels backwards to your bum, against the foot stop.',
    substitutes: ['dumbbell rdls', 'seated hamstring curl'],
    videoId: 'qzHWAg29g4w',
    videoTitle: 'Hamstring Back Extension'
  },
  unilateral_dumbbell_rdls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['hamstrings', 'glutes'],
    description: 'Placing on foot forward of the other, lean your weight onto the front foot and track the dumbbells up and down said forward leg. Ensure you are maintain a straight back while performing this exercise.',
    substitutes: ['barbell rdls', 'hamstring back extensions'],
    videoId: 'C7TGd7M7TmA',
    videoTitle: 'Single Leg Romanian Deadlift'
  },
  seated_hamstring_curl: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['hamstrings'],
    description: 'With you knees locked into place, try to pull your heels back as far as you can towards your bum.',
    substitutes: ['dumbbell rdls', 'seated hamstring curl'],
    videoId: 'KLxPgp2HRYU',
    videoTitle: 'Seated Hamstring Curl Machine'
  },
  tbar_rdls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['hamstrings'],
    description: 'With the bar between your legs, and your feet place slightly in-front of your center of gravity, slowly sit back keep your legs mostly straight, until the weight touches the ground. Maintain a straight back during the execution of this exercise.',
    substitutes: ['dumbbell rdls', 'unilateral dumbbell rdls'],
    videoId: 'IGVDP9wCTTA',
    videoTitle: 'T-Bar Romanian Deadlift'
  },
  lying_machine_hamstring_curls: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['hamstrings'],
    description: 'Lying on the machine, curl your heels back to your bum, and then slowly release.',
    substitutes: ['tbar rdls', 'seated hamstring curl'],
    videoId: '1Tq3QdYUuHs',
    videoTitle: 'Lying Hamstring Curl Machine'
  },
  lying_dumbbell_hamstring_curls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbell']
    },
    unit: 'reps',
    muscles: ['hamstrings'],
    description: 'Lying face down on the ground, hold a dumbbell up in the air between your feet, knees bent. Slowly lower the dumbbell down towards the ground, and after touching the ground, curl the dumbbell back up, heels pulling back towards up bum and up towards the ceiling.',
    substitutes: ['tbar rdls', 'seated hamstring curl'],
    videoId: 'oTCaFg-jGFs',
    videoTitle: 'Lying Dumbbell Hamstring Curl'
  },
  cable_leg_adduction: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'Standing adjacent to the cable machine, with the cable at the lowest placement, place the handle around your outer foot and adduct that foot out horizontally, away from the cable machine.',
    substitutes: ['cable kickbacks'],
    videoId: 'tqnBhFJu-QY',
    videoTitle: 'Cable Hip Abduction'
  },
  cable_kickbacks: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'Facing the cable machine, place the cable machine at the lowest placement, and with the handle wrapped around your ankle, kick your heel backwards as far as you can.',
    substitutes: ['cable leg adduction'],
    videoId: 'Kh69EuKBdrc',
    videoTitle: 'Cable Glute Kickbacks'
  },
  hip_thrusts: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'With your back rest on an elevated surface, or on the ground, and your knees bent to appoximately 90 degrees, thrust your hips forward and tuck your chin. Without moving your heels, try to pull them back towards your bum throughout the motion.',
    substitutes: ['unilateral hip thrusts'],
    videoId: 'SEdqd1n0cvg',
    videoTitle: 'Hip Thrust Exercise'
  },
  unilateral_hip_thrusts: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'With your back rest on an elevated surface, or on the ground, and one knee bent to appoximately 90 degrees (the ohter leg extended), thrust your hips forward and tuck your chin. Without moving your heel, try to pull them back towards your bum throughout the motion.',
    substitutes: ['cable kickbacks'],
    videoId: 'kLh36_7-k7I',
    videoTitle: 'Single Leg Hip Thrust'
  },
  deadlift: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['back', 'hamstrings'],
    description: 'Standing with the bar over your feet, grip it overhand shoulder width apart, while ensuring you back remains straight throughout the entire exercise. Begin the lift by straightening your legs, dragging the bar up your shins, and as soon as the bar is above knee height, straighten your torso and lean back to heavy the bar off the ground. In reverse, you start standing tall, and with a micro bend in your knees, you hinge at the hips (maintaining a straight) back until the bar is over you knees, at which point your hips stop hinging and your knees start bending until the bar touches the ground. This exercise may also be done with a sumo stance.',
    substitutes: ['romanian deadlifts'],
    videoId: 'op9kVnSso6Q',
    videoTitle: 'Deadlift Form Tutorial'
  },
  donkey_kicks: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'You\'re a donkey, on your four limbs. Your owner is particularly annoying, standing directly behind you. With one leg, kick backwards and up as much as you can to teach them a lesson.',
    substitutes: ['cable kickbacks'],
    videoId: '4ranVQDqlaI',
    videoTitle: 'Donkey Kicks Exercise'
  },
  good_girls: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'On the good girls machine we learn to keep our legs closed. Seated, you want to bring your knees together.',
    substitutes: ['cable kickbacks'],
    videoId: 'hKRCwE7qpns',
    videoTitle: 'Hip Adduction Machine'
  },
  fire_hydrants: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'As if your weren\'t already a dog, hop down on all fours, with your hands underneath your pectorals. Now let your natural instincts take control, raising one leg out to the side as if to take care of business on the neighborhood firehydrant. Keep all other three points of contact station throughout this movement.',
    substitutes: ['froggy pumps'],
    videoId: 'SLGaLEki_xo',
    videoTitle: 'Fire Hydrant Exercise'
  },
  froggy_pumps: {
    type: 'accessory',
    meta: {
      environment: 'gym',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'Lying flat on your back, drag your feet back towards your bum until your knees are bent at a 90 degree angle. With your feet still firm on the ground and touching, drop your knees to either side of your body. Now that you are in position, push down through the outsides of your feet so your bum and lower back lift off the ground. Pause while elevated, and then lower back down.',
    substitutes: ['cable kickbacks', 'fire hydrants'],
    videoId: 'C3Ut9kqe7Ms',
    videoTitle: 'Frog Pumps Exercise'
  },
  bad_girls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'On the bad girls machine, or with a band around your knees while sitting on a chair, we reject conservatism by strengthening our abduction muscles, pushing our knees apart.',
    substitutes: ['cable kickbacks'],
    videoId: 'D3Fy1Bk0jUY',
    videoTitle: 'Hip Abduction Exercise'
  },
  seated_calf_raises: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      toes_in: 'Face your toes 30 degrees inwards from forwards while completing this movement.',
      standard: 'Ensure your feet are directioned forward and shoulder width apart.',
      toes_out: 'Face your toes 30 degrees outwards from forwards while completing this movement.'
    },
    unit: 'reps',
    muscles: ['calves'],
    description: 'Standing with weight loaded either in your hands or on your shoulders, you want to plantar flex your toes.',
    substitutes: ['seated calf raises'],
    videoId: 'mI89UcT8dAA',
    videoTitle: 'Seated Calf Raises'
  },
  walking_calf_raises: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['calves'],
    description: 'With weights in each hand, walk 50 paces where on each step you want to step up on your tippy toes to the maximal extreme.',
    substitutes: ['standing calf raises'],
    videoId: 'k2xJTNKqq3U',
    videoTitle: 'Walking Calf Raises'
  },
  unilateral_calf_raises: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    variants: {
      toes_in: 'Face your toes 30 degrees inwards from forwards while completing this movement.',
      standard: 'Ensure your feet are directioned forward.',
      toes_out: 'Face your toes 30 degrees outwards from forwards while completing this movement.'
    },
    unit: 'reps',
    muscles: ['calves'],
    description: 'Weight supported on the ball of one foot, calf raise.',
    substitutes: ['seated calf raises'],
    videoId: 'aElLkfhkpuo',
    videoTitle: 'Single Leg Calf Raises'
  },
  monster_walks: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['band']
    },
    unit: 'reps',
    muscles: ['glutes'],
    description: 'With a band around your knees, squat to a 60 degree knee bend, and crab walk side to side, then dinosaur walk front to back.',
    substitutes: ['bad girls'],
    videoId: 'hOBPjJJWjD4',
    videoTitle: 'Monster Walks Exercise'
  },
  dumbbell_curls: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells', 'bands']
    },
    variants: {
      hammer: 'Perform this exercise with a neutral grip, palms facing your body throughout the movement.',
      supinated: 'Maintain a supinated grip on the dumbbell throughout the motion - palms facing forwards through to upwards.',
      alternating: 'Begin the curl with dumbbells in a neutral grip, finishing with you palm supinated and facing the ceiling.'
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'Perform this exercise seated or standing with dumbbells in either hand by your sides. You can perform both hands at the same time or alternating. Curl each dumbbell upwards from your side until your elbows are fully bent, and the dumbbell is raised. Minimise swinging or shoulder usage throughout the movement.',
    substitutes: ['hammer curls'],
    videoId: 'ykJmrZ5v0Oo',
    videoTitle: 'Dumbbell Bicep Curls'
  },
  rope_curls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'Using the rope cable attachment at the lowest elevation, hold the ends of the rope attachment with a neutral grip and curl them inwards and upwards',
    substitutes: ['dumbbell hammer curls'],
    videoId: 'WwJYh-NgcmY',
    videoTitle: 'Cable Rope Hammer Curls'
  },
  spider_curl: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    variants: {
      hammer: 'Perform this exercise with a neutral grip, palms facing your body throughout the movement.',
      supinated: 'Maintain a supinated grip on the dumbbell throughout the motion - palms facing forwards through to upwards.',
      alternating: 'Begin the curl with dumbbells in a neutral grip, finishing with you palm supinated and facing the ceiling.'
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'With you chest support on an inclined bench and with dumbbells in either hand, perform an alternating curl with a supinated wrist at the peak of the motion. Curl the dumbbells slightly inwards and under the bench.',
    substitutes: ['barbell curls'],
    videoId: 'HQ9FfP5mCqY',
    videoTitle: 'Spider Curls Exercise'
  },
  barbell_curls: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    variants: {
      wide_grip: 'Perform this exercise with hands space one and a half times shoulder width apart.',
      narrow_grip: 'Perform this exercise with hands only a palms width apart.',
      standard: 'Perform this exercise with hands spaced shoulder width apart.'
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'Hold the barbell with a supinated grip and reduce shoulder engagement and swinging throughout the curl.',
    substitutes: ['dumbbell curls'],
    videoId: 'kwG2ipFRgfo',
    videoTitle: 'Barbell Bicep Curls'
  },
  drag_curls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell', 'dumbbells']
    },
    variants: {
      dumbbell: 'Perform this exercise with dumbbells.',
      barbell: 'Perform this exercise with a barbell, and space your hands slightly wider than shoulder width apart.'
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'Holding the weight with a supinated grip, drag the weights up an imaginary line in the same plane as your torso. It is a similar movement to a row with the major difference that you are standing mostly upright, only very slightly bent fowards at the hips.',
    substitutes: ['dumbbell curls'],
    videoId: 'Vl_4C5XF8KU',
    videoTitle: 'Drag Curls Exercise'
  },
  unilateral_hammer_cable_curl: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'Holding the carribena, of the cable machine on the lowest elevation, in one hand, curl upwards and inwards so your hand finishes in the middle of your chest.',
    substitutes: ['hammer curl'],
    videoId: 'mGvzVjuEaQA',
    videoTitle: 'Single Arm Cable Hammer Curl'
  },
  preacher_curls: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells', 'barbell']
    },
    variants: {
      underhand: 'Hold a barbell or easy-curl bar with an underhand grip, palms facing the ceiling.',
      neutral_grip: 'Perform this exercise with dumbbells in each hand, with a neutral grip, palms facing the horizontal.',
      overhand: 'Hold a barbell or easy-curl bar with an overhand grip, palms facing the ground.'
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'Perform this curl with your elbows supported on a surface angled 45 degrees down and away from you, or on the preacher curl machine. It is good practice to micro-pause at the bottom of the eccentric portion of the movement.',
    substitutes: ['barbell curl'],
    videoId: 'fIWP-FRFNU0',
    videoTitle: 'Preacher Curls Exercise'
  },
  cable_bar_curls: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['biceps'],
    description: 'Using the bar cable attachment at the lowest elevation, hold each end of the bar with a supinated grip (palms to the ceiling) and curl the weight up, minimizing shoulder engagement and swinging.',
    substitutes: ['dumbbell hammer curls'],
    videoId: 'h2GhTHiWl7k',
    videoTitle: 'Cable Bar Curls'
  },
  tricep_rope_pushdown: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Adjust the cable to maximum elevation. Keeping your elbows just in-front of your sides, straighten your arms, pushing the weight down. Try to keep you elbows stationary in space throughout the motion. At the bottom of the pushing movement, twist the ropes handles down so that your palms face downwards as opposed to eachother.',
    substitutes: ['bar cable pushdown'],
    videoId: 'vB5OHsJ3EME',
    videoTitle: 'Tricep Rope Pushdown'
  },
  tricep_bar_pushdown: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Adjust the cable to maximum elevation. Keeping your elbows just in-front of your sides, straighten your arms, pushing the weight down. Try to keep you elbows stationary in space throughout the motion.',
    substitutes: ['rope cable pushdown'],
    videoId: 'REyfDY-aq50',
    videoTitle: 'Tricep Bar Pushdown'
  },
  unilateral_cable_pushdown: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    variants: {
      overhand: 'Use a handle attachment and press the weight down with your palm facing the ground.',
      neutral: 'Hold the cable attachment with a neutral hammer grip.',
      underhand: 'Use a handle attachment with a supinated grip, palm facing the ceiling, press/pulling the weight down.'
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Adjust the cable to maximum elevation. Keeping your elbow just in-front of your hip, straighten your arms, pushing the weight down. Try to keep you elbows stationary in space throughout the motion.',
    substitutes: ['rope cable pushdown'],
    videoId: 'Ups9Hlz5lmw',
    videoTitle: 'Single Arm Cable Pushdown'
  },
  skull_crushers: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell']
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Lie either on a flat or on a slighty inclined surface with a barbell directly above your skull. Starting with your arms straight, lower the weight down either to your forehead, or down behind your head and then press it back up. Vary your grip width to whatever is most comfortable for you and keep your elbows tucked throughout the movement.',
    substitutes: ['face press'],
    videoId: '05mY9YlzqMM',
    videoTitle: 'Skull Crushers Exercise'
  },
  face_press: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'In an incline plank position with your hands pressing on something mid-chest height (hands closer than shoulder width), keep your elbows tucked and slowly lower your body/face towards the surface. Then press back up. Your elbows should track directly downwards, not flaring to either side.',
    substitutes: ['overhead_skull_crushers'],
    videoId: 'QD3edJ-PJ8A',
    videoTitle: 'Tricep Face Press'
  },
  overhead_skull_crusher: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['barbell', 'dumbbell', 'bands']
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Performed with either a barbell, dumbbell or cable attachment, start with the weight down behind your head while sitting vertically (elbows overhead). Straighten your arms overhead, extending the weight up above your head.',
    substitutes: ['rope cable pushdown'],
    videoId: 'c5jmz9shKJU',
    videoTitle: 'Overhead Tricep Extension'
  },
  tricep_dip: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Perform with a bench behind you and your legs out in-front of you, your body supported by your hands on the bench. Slowly lower your bum down in-front of the bench, elbows tucked and tracking back behind you, and then press back up.',
    substitutes: ['rope cable pushdown'],
    videoId: 'VdSQXOhDYBs',
    videoTitle: 'Tricep Dips Exercise'
  },
  dumbbell_skull_crushers: {
    type: 'compound',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['dumbbells']
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Lie either flat or on a slight incline with heavy dumbbells in each hand directly above your skull. Starting with your arms straight, lower the weight down either either side of your forehead and then press it back up. Begin with palms facing the ceiling to neutral grip besides your ears.',
    substitutes: ['face press'],
    videoId: 'aA5a3LGcGAg',
    videoTitle: 'Dumbbell Skull Crushers'
  },
  diamond_pushups: {
    type: 'accessory',
    meta: {
      environment: 'home',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Position yourself in a pushup position, but adjust your hands, bringing them inwards, so that your fingers point inwards, the tips of your fingers are touching, and so that you can form a diamond, completing the shape by connecting your thumbs at the bottom of the diamond. Perform the pushup, keeping your elbows tucked in beside your body.',
    substitutes: ['face press'],
    videoId: 'J0DnG1_S92I',
    videoTitle: 'Diamond Push-Ups'
  },
  unilateral_cable_push_aways: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['triceps'],
    description: 'Lie either flat or on a slight incline with heavy dumbbells in each hand directly above your skull. Starting with your arms straight, lower the weight down either either side of your forehead and then press it back up. Begin with palms facing the ceiling to neutral grip besides your ears.',
    substitutes: ['face press'],
    videoId: 'klXLOD9t3os',
    videoTitle: 'Single Arm Cable Kickback'
  },
  jack_knives: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Sitting on your heiny in a V shape with your knees bent and feet elevated, your hands stabilizing your body either side and slightly behind your bum, extend your legs our keeping them elevated and lean back slightly. Then bring your knees back in to your chest. Maintain a tucked core throughout this movement.',
    substitutes: ['crunches'],
    videoId: 'HIZSHHvaGZo',
    videoTitle: 'Jack Knife Exercise'
  },
  crunches: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Lying flat on the ground with your knees bent at right angles, crunch your abs and imagine you\'re trying to squash a bug under your lower back deep into the ground.',
    substitutes: ['dead_bugs', 'bicycle_crunches'],
    videoId: 'XEWdZJ8xJyQ',
    videoTitle: 'Perfect Crunch Form'
  },
  l_sits: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Sitting (with your legs straight out in front of you), or hanging, hold your legs up and your core tucked in an isometric hold. Legs should be at minimum parallel to the ground.',
    substitutes: ['banana_hold', "plank"],
    videoId: 'ov41wRUOtmE',
    videoTitle: 'L-Sit Exercise'
  },
  russian_twists: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Sitting on your dump-truck booty with your legs bent at 90 degrees in front of your and your feet on the ground, lean back about 30 degrees and twist your torso and shoulders, touching the ground on either side of your bum with both hands, and then repeat, both hands to the other side.',
    substitutes: ['jack_knives'],
    videoId: 'wkD8rJzKe0I',
    videoTitle: 'Russian Twists Exercise'
  },
  plank: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Be the plank. Make sure your hips are tucked, your bum squeeze, your core tight, flat as a pancake.',
    substitutes: ['banana_hold, side_plank'],
    videoId: 'pSHjTRCQxIw',
    videoTitle: 'Perfect Plank Form'
  },
  side_plank: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Similar to the traditional plank, you want to support your weight between your feet and one elbow as you hold your body looking perpendicular to the ground. Straight as a plank.',
    substitutes: ['banana_hold', 'plank'],
    videoId: 'K2VljzCC16g',
    videoTitle: 'Side Plank Exercise'
  },
  crunch_toes_touches: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Lying flat on the ground with your knees bent 90 degrees and feet flat on the ground, crunch your body up, and proceed to touch your left hand to your left foot and then your right hand to your right foot. Keep your head at the same level, just crunching your obliques on either side.',
    substitutes: ['russian_twists'],
    videoId: 'sEciVo12c68',
    videoTitle: 'Toe Touch Crunches'
  },
  dead_bugs: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Did you see that deadly bird flying overhead? Quickly, play dead, lie flat on your back and point your arms and legs directly up towards the sky. Now slowly lower one arm and the opposite leg down to the ground, keeping a tucked and tight core. Then raise them up, and repeat on with the remaining opposite limbs.',
    substitutes: ['crunches', 'lying_leg_lifts'],
    videoId: 'g_BYB0R-4Ws',
    videoTitle: 'Dead Bug Exercise'
  },
  lying_leg_lifts: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Recline, relax, lie flat on your back, ready for a res... to raise your legs up to the sky and then back down to the ground. Legs straight, core tucked, if you can fit your hands under your lower back at any part of the movement then bend your knees a bit more.',
    substitutes: ['jack_knives', 'hanging_knee_raises'],
    videoId: 'JB2oyawG9KI',
    videoTitle: 'Lying Leg Raises'
  },
  hanging_knee_raises: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Like the monkey you are, hang from the bar, you hairy gorilla. Now raise your knees up, tuck your core, and hopefully you can touch your forehead to your knees. Release slowly down and try to reduce swinging momentum.',
    substitutes: ['lying_leg_lifts', 'v_crunches'],
    videoId: 'hdng3Nm1x_E',
    videoTitle: 'Hanging Knee Raises'
  },
  mountain_climbers: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'In a push-up position, bring one knee up to touch one elbow, and then resume push-up position. Repeat on the other side. Avoid letting your lower back and bum sag during the motion.',
    substitutes: ['plank', 'kneeling_cable_crunch'],
    videoId: 'nmwgirgXLYM',
    videoTitle: 'Mountain Climbers Exercise'
  },
  kneeling_cable_crunch: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: ['bands']
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'You have sinned and now you must beg for forgiveness. On your knees, hold the cable rope extension behind your head with both hands (ensure it is at it\'s maximum height). Crunch your face down and kiss the ground, then slowly release back up.',
    substitutes: ['jack_knives', 'dead_bug'],
    videoId: 'HaCkn6FpsaA',
    videoTitle: 'Kneeling Cable Crunch'
  },
  bicycle_crunches: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'reps',
    muscles: ['abs'],
    description: 'Lying flat on your back, bend your knees at 90 degrees and raise your bent legs above your body so your knees point the ceiling. Now crunch one elbow up to touch the opposite knee, while extending your other leg out straight. Return to the initial position, and then repeat on the other side.',
    substitutes: ['dead_bugs', 'hanging_knee_raises'],
    videoId: '9FGilxCbdz8',
    videoTitle: 'Bicycle Crunches Exercise'
  },
  banana_hold: {
    type: 'accessory',
    meta: {
      environment: 'gymhome',
      level: [0, 1, 2],
      equipment: []
    },
    unit: 'duration',
    muscles: ['abs'],
    description: 'Lying flat on your back, pretend that your are a ripe and firm banana. Curve your whole body, crunching your core and lower back flat and firm down into the ground below you, and raise your pointed arms off the ground, pointing out behind your head, and your legs off the ground at a 30 degree angle. Shiver and quiver as your acknowledge your failing core muscles.',
    substitutes: ['plank', 'leg_lifts'],
    videoId: 'TQ4jOTvOzKM',
    videoTitle: 'Banana Hold Exercise'
  }
}