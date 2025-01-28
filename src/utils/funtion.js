import { EXERCISES, SCHEMES, TEMPOS, WORKOUTS } from "./swoldier";

const exercises = exercisesFlattener(EXERCISES);

export function GenerateWorkout(args) {
    const { muscle, poison: workout, goal } = args;

    let exer = Object.keys(exercises);
    exer = exer.filter((key) => exercises[key].meta.environment !== "home");
    let includedTracker = [];
    let listOfMuscles;

    // Determine the list of muscles based on workout type
    if (workout === "individual") {
        listOfMuscles = muscle;
    } else {
        listOfMuscles = WORKOUTS[workout]?.[muscle[0]];

        if (!listOfMuscles) {
            console.warn("Invalid workout or muscle group:", workout, muscle[0]);
            return []; // Return an empty workout if data is invalid
        }
    }
    
    console.log('debug', listOfMuscles)
    listOfMuscles = new Set(shuffleArray(listOfMuscles));
    const arrOfMuscles = Array.from(listOfMuscles);
    const scheme = goal;

    // Generate sets structure
    const sets = SCHEMES[scheme].ratio
        .reduce((acc, curr, index) => {
            return [
                ...acc,
                ...Array(parseInt(curr))
                    .fill(null)
                    .map(() => (index === 0 ? "compound" : "accessory")),
            ];
        }, [])
        .reduce((acc, curr, index) => {
            const muscleGroupToUse =
                index < arrOfMuscles.length
                    ? arrOfMuscles[index]
                    : arrOfMuscles[index % arrOfMuscles.length];
            return [
                ...acc,
                {
                    setType: curr,
                    muscleGroup: muscleGroupToUse,
                },
            ];
        }, []);

    // Classify exercises into compound and accessory groups
    const { compound: compoundExercises, accessory: accessoryExercises } =
        exer.reduce(
            (acc, curr) => {
                const exerciseHasRequiredMuscle = exercises[curr].muscles.some((musc) =>
                    listOfMuscles.has(musc)
                );

                if (exerciseHasRequiredMuscle) {
                    return {
                        ...acc,
                        [exercises[curr].type]: {
                            ...acc[exercises[curr].type],
                            [curr]: exercises[curr],
                        },
                    };
                }

                return acc;
            },
            { compound: {}, accessory: {} }
        );

    // Generate the workout
    const genWOD = sets.map(({ setType, muscleGroup }) => {
        const data = setType === "compound" ? compoundExercises : accessoryExercises;
        const filteredObj = Object.keys(data).reduce((acc, curr) => {
            if (
                includedTracker.includes(curr) ||
                !data[curr].muscles.includes(muscleGroup)
            ) {
                return acc;
            }
            return { ...acc, [curr]: exercises[curr] };
        }, {});

        const filteredDataList = Object.keys(filteredObj);
        const filteredOppList = Object.keys(
            setType === "compound" ? accessoryExercises : compoundExercises
        ).filter((val) => !includedTracker.includes(val));

        const randomExercise =
            filteredDataList[
                Math.floor(Math.random() * filteredDataList.length)
            ] ||
            filteredOppList[
                Math.floor(Math.random() * filteredOppList.length)
            ];

        if (!randomExercise) {
            return {};
        }

        let repsOrDuraction =
            exercises[randomExercise].unit === "reps"
                ? Math.min(...SCHEMES[scheme].repRanges) +
                  Math.floor(
                      Math.random() *
                          (Math.max(...SCHEMES[scheme].repRanges) -
                              Math.min(...SCHEMES[scheme].repRanges))
                  ) +
                  (setType === "accessory" ? 4 : 0)
                : Math.floor(Math.random() * 40) + 20;

        const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];

        // Adjust reps/duration based on tempo and constraints
        if (exercises[randomExercise].unit === "reps") {
            const tempoSum = tempo
                .split(" ")
                .reduce((acc, curr) => acc + parseInt(curr), 0);
            if (tempoSum * repsOrDuraction > 85) {
                repsOrDuraction = Math.floor(85 / tempoSum);
            }
        } else {
            repsOrDuraction = Math.ceil(repsOrDuraction / 5) * 5;
        }

        includedTracker.push(randomExercise);

        return {
            name: randomExercise,
            tempo,
            rest: SCHEMES[scheme]["rest"][setType === "compound" ? 0 : 1],
            reps: repsOrDuraction,
            ...exercises[randomExercise],
        };
    });

    return genWOD.filter((element) => Object.keys(element).length > 0);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) { // <-- array is undefined
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  

function exercisesFlattener(exercisesObj) {
    const flattenedObj = {};

    for (const [key, val] of Object.entries(exercisesObj)) {
        if (!val.variants) {
            flattenedObj[key] = val;
        } else {
            for (const variant in val.variants) {
                const variantName = `${variant}_${key}`;
                const variantSubstitutes = Object.keys(val.variants)
                    .map((element) => `${element}_${key}`)
                    .filter((element) => element !== variantName);

                flattenedObj[variantName] = {
                    ...val,
                    description: `${val.description}___${val.variants[variant]}`,
                    substitutes: [...val.substitutes, ...variantSubstitutes].slice(0, 5),
                };
            }
        }
    }

    return flattenedObj;
}
