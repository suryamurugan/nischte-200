import { Engine } from "json-rules-engine";

const validateOffer = (offer) => {
  const errors = [];

  if (!offer.offerType || !offer.offerType.name) {
    errors.push("Offer type is missing.");
  }

  if (
    !offer.offerDescription ||
    typeof offer.offerDescription.minOrder === "undefined"
  ) {
    errors.push("Minimum order amount is missing.");
  }

  return errors.length ? errors : null;
};

const createOfferRules = (offer, visitCount) => {
  const engine = new Engine();

  /* Flat-discount */
  engine.addRule({
    conditions: {
      all: [
        {
          fact: "offer",
          path: ".offerType.name",
          operator: "equal",
          value: "Flat-Discount",
        },
        {
          fact: "offer",
          path: ".offerDescription.minOrder",
          operator: "greaterThanInclusive",
          value: offer.offerDescription.minOrder,
        },
        {
          fact: "offer",
          path: ".offerDescription.numberOfVisits",
          operator: "greaterThanInclusive",
          value: visitCount,
        },
      ],
    },
    event: {
      type: "Flat-Discount",
      params: {
        message: "Flat discount applied!",
        discountRate: offer.offerDescription.discountRate,
      },
    },
  });

  /* Plus-Offer */
  engine.addRule({
    conditions: {
      all: [
        {
          fact: "offer",
          path: ".offerType.name",
          operator: "equal",
          value: "Plus-Offer",
        },
        {
          fact: "offer",
          path: ".offerDescription.plusOffers",
          operator: "greaterThan",
          value: offer.offerDescription.plusOffers,
        },
        {
          fact: "offer",
          path: ".offerDescription.numberOfVisits",
          operator: "greaterThanInclusive",
          value: visitCount,
        },
      ],
    },
    event: {
      type: "Plus-Offer",
      params: {
        message: `You get ${offer.offerDescription.plusOffers} additional items!`,
        plusOffers: offer.offerDescription.plusOffers,
      },
    },
  });

  /* Special-Occassion */
  engine.addRule({
    conditions: {
      all: [
        {
          fact: "offer",
          path: ".offerType.name",
          operator: "equal",
          value: "Special-Offer",
        },
        {
          fact: "offer",
          path: ".offerDescription.specialOccasionDate",
          operator: "equal",
          value: new Date().toISOString().slice(0, 10),
        },
        {
          fact: "offer",
          path: ".offerDescription.numberOfVisits",
          operator: "greaterThanInclusive",
          value: visitCount,
        },
      ],
    },
    event: {
      type: "Special-Offer",
      params: {
        message: "Special offer valid today!",
        specialOccasionDate: offer.offerDescription.specialOccasionDate,
      },
    },
  });

  /* Complimentary Offer */
  engine.addRule({
    conditions: {
      all: [
        {
          fact: "offer",
          path: ".offerType.name",
          operator: "equal",
          value: "Complimentary",
        },
        {
          fact: "offer",
          path: ".offerDescription.numberOfVisits",
          operator: "greaterThanInclusive",
          value: visitCount,
        },
      ],
    },
    event: {
      type: "Complimentary",
      params: {
        message: "Enjoy a complimentary item!",
      },
    },
  });

  /* Discount-Dish */
  engine.addRule({
    conditions: {
      all: [
        {
          fact: "offer",
          path: ".offerType.name",
          operator: "equal",
          value: "Discount-Dishes",
        },
        {
          fact: "offer",
          path: ".offerDescription.discountDishes",
          operator: "notEqual",
          value: [],
        },
        {
          fact: "offer",
          path: ".offerDescription.numberOfVisits",
          operator: "greaterThanInclusive",
          value: visitCount,
        },
      ],
    },
    event: {
      type: "Discount-Dishes",
      params: {
        message: "Discount available on selected dishes!",
        discountDishes: offer.offerDescription.discountDishes,
      },
    },
  });

  return engine;
};

export const executeOfferRules = async (offer, visitCount) => {
  const validationError = validateOffer(offer);
  if (validationError) {
    return { success: false, errors: validationError };
  }

  const engine = createOfferRules(offer, visitCount);
  const facts = { offer };
  const results = await engine.run(facts);

  let appliedOffers = [];

  if (results.events.length) {
    results.events.forEach((event) => {
      if (event.type === "Flat-Discount") {
        appliedOffers.push({
          type: "Flat-Discount",
          discountRate: event.params.discountRate,
        });
      } else if (event.type === "Plus-Offer") {
        appliedOffers.push({
          type: "Plus-Offer",
          plusOffers: offer.offerDescription.plusOffers,
        });
      } else if (event.type === "Special-Offer") {
        appliedOffers.push({
          type: "Special-Offer",
        });
      } else if (event.type === "Complimentary") {
        appliedOffers.push({
          type: "Complimentary",
        });
      } else if (event.type === "Discount-Dishes") {
        appliedOffers.push({
          type: "Discount-Dishes",
          discountDishes: offer.offerDescription.discountDishes,
        });
      }
    });

    return { success: true, appliedOffers };
  } else {
    return {
      success: true,
      appliedOffers: [],
    };
  }
};
