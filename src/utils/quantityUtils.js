export const QUANTITY_LIMITS = {
  MIN: 0.5,
  MAX: 200,
  STEP: 0.5,
};

const EPSILON = 1e-6;

const toStepCount = (value) => Math.round(value / QUANTITY_LIMITS.STEP);

export const normalizeQuantity = (value) => {
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric)) {
    return QUANTITY_LIMITS.MIN;
  }

  const clamped = Math.min(QUANTITY_LIMITS.MAX, Math.max(QUANTITY_LIMITS.MIN, numeric));
  const stepped = toStepCount(clamped) * QUANTITY_LIMITS.STEP;
  return parseFloat(stepped.toFixed(1));
};

export const isWithinRange = (value) =>
  value >= QUANTITY_LIMITS.MIN - EPSILON && value <= QUANTITY_LIMITS.MAX + EPSILON;

export const isOnStep = (value) =>
  Math.abs(value / QUANTITY_LIMITS.STEP - Math.round(value / QUANTITY_LIMITS.STEP)) < EPSILON;

export const validateQuantity = (value) => {
  if (value === '' || value === null || value === undefined) {
    return {
      valid: false,
      normalized: QUANTITY_LIMITS.MIN,
      message: 'Please enter a quantity.',
    };
  }

  const numeric = parseFloat(value);

  if (Number.isNaN(numeric)) {
    return {
      valid: false,
      normalized: QUANTITY_LIMITS.MIN,
      message: 'Please enter a valid number.',
    };
  }

  if (!isWithinRange(numeric)) {
    return {
      valid: false,
      normalized: normalizeQuantity(numeric),
      message: `Quantity must be between ${QUANTITY_LIMITS.MIN} kg and ${QUANTITY_LIMITS.MAX} kg`,
    };
  }

  if (!isOnStep(numeric)) {
    return {
      valid: false,
      normalized: normalizeQuantity(numeric),
      message: 'Please select weight in 0.5 kg steps (e.g., 0.5, 1.0, 1.5 …).',
    };
  }

  const normalized = normalizeQuantity(numeric);

  return {
    valid: true,
    normalized,
    message: '',
  };
};

export const toDisplayQuantity = (quantity) =>
  parseFloat(normalizeQuantity(quantity).toFixed(1));

export const calculateLineTotal = (unitPrice, quantity) => {
  const total = Number(unitPrice || 0) * normalizeQuantity(quantity);
  return parseFloat(total.toFixed(2));
};

export const formatCurrency = (amount) =>
  `₹${parseFloat(Number(amount || 0).toFixed(2)).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;


