import { ScienceCard } from '../types';

export const SCIENCE_CARDS_DATABASE: ScienceCard[] = [
  {
    id: 'sci_1',
    term: 'Quantum Superposition',
    field: 'Quantum Physics',
    pronunciation: 'KWAN-tuhm soo-per-poh-ZISH-uhn',
    etymology: 'Latin "quantus" (how much) + "superponere" (to place above)',
    definition: 'A fundamental principle of quantum mechanics stating that a physical system exists simultaneously in all possible theoretical states until it is observed or interacts with its environment.',
    breakthroughFact: 'In 2020, physicists successfully placed macroscopic molecules containing up to 2,000 atoms into quantum superposition across a double slit, proving quantum behavior extends far beyond elementary particles.',
    discoveryYear: '1925',
    discoverer: 'Erwin Schrödinger & Werner Heisenberg',
    realWorldImpact: 'Powers quantum computing qubits, enabling exponential parallelism in cryptographic breakthroughs and molecular drug discovery.',
    xpReward: 650,
    quiz: {
      question: 'What event collapses a quantum wave function from multiple superposed states into a single definite eigenstate?',
      options: ['Measurement / Wave function collapse', 'Gravitational repulsion', 'Thermal equilibrium', 'Photonic decay'],
      correctIndex: 0,
      explanation: 'Observation or decoherence with the environment forces the quantum wave function to collapse into a single measurable reality.'
    }
  },
  {
    id: 'sci_2',
    term: 'CRISPR-Cas9',
    field: 'Molecular Biology',
    pronunciation: 'KRIS-per kas-NINE',
    etymology: 'Clustered Regularly Interspaced Short Palindromic Repeats + CRISPR-associated protein 9',
    definition: 'A bacterial adaptive immune defense mechanism repurposed as a molecular gene-editing tool capable of cutting DNA sequences at exact base-pair coordinates with programmable RNA guides.',
    breakthroughFact: 'Bacteria keep molecular mugshots of invading viral bacteriophage DNA inside their CRISPR spacers, passing genetic immunity to billions of descendant generations.',
    discoveryYear: '2012',
    discoverer: 'Jennifer Doudna & Emmanuelle Charpentier',
    realWorldImpact: 'Revolutionized curative gene therapies for sickle cell anemia, hereditary blindness, and drought-resistant agriculture.',
    xpReward: 700,
    quiz: {
      question: 'Which component directs the Cas9 enzyme endonuclease to the exact target genomic sequence?',
      options: ['Single-guide RNA (sgRNA)', 'DNA polymerase III', 'Ribosomal tRNA', 'Mitochondrial matrix'],
      correctIndex: 0,
      explanation: 'The programmable guide RNA binds complementarily to the target DNA strand, positioning Cas9 for a double-strand break.'
    }
  },
  {
    id: 'sci_3',
    term: 'Telomerase',
    field: 'Biochemistry',
    pronunciation: 'tuh-LAHM-er-ays',
    etymology: 'Greek "telos" (end) + "meros" (part) + "-ase" (enzyme)',
    definition: 'A ribonucleoprotein reverse transcriptase enzyme that elongates telomeric repetitive DNA caps at chromosome ends, counteracting the end-replication problem of cell division.',
    breakthroughFact: 'Most human somatic cells lack active telomerase and die after roughly 50 divisions (the Hayflick Limit), while embryonic stem cells and 90% of malignant cancer cells activate telomerase for biological immortality.',
    discoveryYear: '1984',
    discoverer: 'Elizabeth Blackburn & Carol Greider',
    realWorldImpact: 'Pivotal target in anti-aging biotechnology and cancer oncological therapeutics.',
    xpReward: 600,
    quiz: {
      question: 'What is the natural limit of human somatic cellular division caused by telomere shortening called?',
      options: ['The Hayflick Limit', 'The Carnot Threshold', 'The Planck Length', 'The Shannon Bound'],
      correctIndex: 0,
      explanation: 'Leonard Hayflick discovered in 1961 that normal human cells divide approximately 40 to 60 times before senescence due to telomere depletion.'
    }
  },
  {
    id: 'sci_4',
    term: 'Synaptic Pruning',
    field: 'Neuroscience',
    pronunciation: 'sih-NAP-tik PROON-ing',
    etymology: 'Greek "synapsis" (clasping together/connection)',
    definition: 'The neurological developmental process wherein microglia and glial cells systematically dismantle underutilized dendritic spines and axon terminals to optimize neural efficiency.',
    breakthroughFact: 'A human infant possesses approximately twice as many synaptic connections as an adult brain; adolescent pruning eliminates billions of redundant synapses to crystallize abstract executive reasoning.',
    discoveryYear: '1979',
    discoverer: 'Peter Huttenlocher',
    realWorldImpact: 'Explains critical sensitive periods in language acquisition and provides structural clues to neurodevelopmental conditions.',
    xpReward: 550,
    quiz: {
      question: 'Which specialized glial cell type acts as the primary "gardener" phagocytosing excess synapses during pruning?',
      options: ['Microglia', 'Erythrocytes', 'Schwann cells', 'Oligodendrocytes'],
      correctIndex: 0,
      explanation: 'Microglia act as active immune sentinels in the central nervous system, engulfing and clearing tagged inactive synapses.'
    }
  },
  {
    id: 'sci_5',
    term: 'Event Horizon',
    field: 'Astrophysics',
    pronunciation: 'ih-VENT huh-RY-zuhn',
    etymology: 'Greek "horizein" (to bound or limit)',
    definition: 'The spatiotemporal boundary enveloping a black hole at radius R = 2GM/c² beyond which the escape velocity exceeds the speed of light in vacuum, preventing causal escape.',
    breakthroughFact: 'To an outside observer, an astronaut falling into an event horizon appears to slow down and freeze indefinitely due to extreme gravitational time dilation, while redshifted light fades into infrared.',
    discoveryYear: '1916',
    discoverer: 'Karl Schwarzschild',
    realWorldImpact: 'Directly imaged in 2019 around supermassive black hole M87* by the global Event Horizon Telescope interferometer.',
    xpReward: 650,
    quiz: {
      question: 'What happens to the escape velocity at the exact threshold of the event horizon?',
      options: ['It equals the speed of light (c)', 'It drops to zero', 'It fluctuates sinusoidally', 'It doubles Planck velocity'],
      correctIndex: 0,
      explanation: 'At the event horizon boundary, escape velocity equals c; within it, all light and matter paths inevitably terminate at the gravitational singularity.'
    }
  },
  {
    id: 'sci_6',
    term: 'Epigenetics',
    field: 'Molecular Biology',
    pronunciation: 'ep-ih-juh-NET-iks',
    etymology: 'Greek "epi-" (over, outside of) + genetics',
    definition: 'The study of stable, heritable changes in gene expression and cellular phenotype occurring without alterations to the underlying DNA nucleotide sequence, mediated by histone acetylation and DNA methylation.',
    breakthroughFact: 'Environmental stressors, exercise, and diet directly methylate DNA promoters, silencing or activating genes in real-time and even passing metabolic markers across transgenerational lines.',
    discoveryYear: '1942',
    discoverer: 'Conrad Waddington',
    realWorldImpact: 'Underpins personalized longevity medicine, cancer suppression, and understanding how lifestyle influences gene activity.',
    xpReward: 600,
    quiz: {
      question: 'Which chemical modification typically suppresses or silences gene transcription when added to DNA cytosine bases?',
      options: ['DNA Methylation (addition of -CH3)', 'Phosphorylation', 'Glycosylation', 'Hydrolysis'],
      correctIndex: 0,
      explanation: 'Methylation of cytosine-guanine (CpG) islands in promoter regions generally prevents transcription factor binding, silencing the gene.'
    }
  },
  {
    id: 'sci_7',
    term: 'Neuroplasticity',
    field: 'Neuroscience',
    pronunciation: 'noor-oh-plas-TIS-ih-tee',
    etymology: 'Greek "neuron" (nerve) + "plastikos" (capable of being molded)',
    definition: 'The dynamic biological capacity of the central nervous system to modify its structural architecture and functional synaptic weighting in response to learning, environmental experience, or injury.',
    breakthroughFact: 'London taxi drivers memorizing "The Knowledge" of 25,000 labyrinthine streets develop significantly enlarged posterior hippocampi through active neurogenesis and structural dendritic growth.',
    discoveryYear: '1969',
    discoverer: 'Jerzy Konorski & Paul Bach-y-Rita',
    realWorldImpact: 'Proves the human brain retains lifelong adaptation, powering stroke rehabilitation, cognitive brain training, and mastery learning curves.',
    xpReward: 550,
    quiz: {
      question: 'What famous neuroscientific axiom summarizes Hebbian synaptic plasticity?',
      options: ['"Neurons that fire together, wire together"', '"Matter tells space how to curve"', '"Structure dictates genetic destiny"', '"Entropy always increases"'],
      correctIndex: 0,
      explanation: 'Donald Hebb formulated in 1949 that simultaneous activation of interconnected neurons strengthens their synaptic efficacy.'
    }
  },
  {
    id: 'sci_8',
    term: 'Gravitational Lensing',
    field: 'Cosmology',
    pronunciation: 'grav-ih-TAY-shun-uhl LEN-zing',
    etymology: 'Latin "gravitas" (weight) + lens',
    definition: 'The bending and amplification of light emitted from distant background galaxies as it traverses the curved spacetime continuum created by massive foreground clusters or dark matter halos.',
    breakthroughFact: 'Gravitational lenses act as natural cosmic telescopes, magnifying primordial galaxies that formed mere hundreds of millions of years after the Big Bang by factors of over 30×.',
    discoveryYear: '1919 / 1979',
    discoverer: 'Albert Einstein (Predicted) & Walsh et al. (Observed)',
    realWorldImpact: 'Serves as the primary observational technique for mapping invisible dark matter distributions across the cosmic web.',
    xpReward: 650,
    quiz: {
      question: 'What circular optical phenomenon occurs when source, lens, and observer align perfectly in space?',
      options: ['Einstein Ring', 'Newtonian Halo', 'Doppler Disk', 'Schwarzschild Bubble'],
      correctIndex: 0,
      explanation: 'An Einstein Ring forms when light from a background star or galaxy is curved into a complete, symmetrical ring of light around a gravitational lens.'
    }
  },
  {
    id: 'sci_9',
    term: 'ATP Synthase',
    field: 'Biochemistry',
    pronunciation: 'ay-tee-pee SIN-thays',
    etymology: 'Adenosine Triphosphate + "-ase" (enzyme)',
    definition: 'A nanoscopic molecular rotary motor embedded in the inner mitochondrial membrane that harnesses proton motive force (electrochemical gradient) to catalyze the phosphorylation of ADP into ATP energy currency.',
    breakthroughFact: 'The central rotor of ATP synthase spins at up to 9,000 revolutions per minute, producing approximately your entire body weight in ATP molecules every single day.',
    discoveryYear: '1960',
    discoverer: 'Efraim Racker & Paul Boyer',
    realWorldImpact: 'Universal power generator for virtually all aerobic cellular life forms on Earth.',
    xpReward: 600,
    quiz: {
      question: 'What physical gradient drives the rotational spin of the ATP Synthase rotor subunit?',
      options: ['Proton (H+) electrochemical gradient', 'Electron magnetic spin', 'Osmotic pressure of sodium', 'Thermal convection'],
      correctIndex: 0,
      explanation: 'Protons pumped into the intermembrane space flow down their electrochemical concentration gradient through the F0 channel, spinning the rotor.'
    }
  },
  {
    id: 'sci_10',
    term: 'Chirality',
    field: 'Chemistry',
    pronunciation: 'ky-RAL-ih-tee',
    etymology: 'Greek "cheir" (hand)',
    definition: 'The geometric property of molecular asymmetry wherein a chemical molecule cannot be superimposed on its mirror image, giving rise to left-handed (L) and right-handed (D) enantiomers.',
    breakthroughFact: 'Life on Earth is strictly homochiral: all biological proteins are synthesized exclusively from L-enantiomer (left-handed) amino acids, while DNA and RNA backbones use exclusively D-sugars (right-handed).',
    discoveryYear: '1848',
    discoverer: 'Louis Pasteur',
    realWorldImpact: 'Crucial in pharmacology; one enantiomer of a drug can be life-saving while its mirror twin can be biologically inert or toxic (e.g. Thalidomide).',
    xpReward: 650,
    quiz: {
      question: 'Which handiness (enantiomer) characterizes all naturally occurring amino acids incorporated into ribosome-synthesized proteins?',
      options: ['L-amino acids (Left-handed)', 'D-amino acids (Right-handed)', 'Racemic 50/50 mix', 'Achiral planar forms'],
      correctIndex: 0,
      explanation: 'Earth biology exhibits homochirality: all standard ribosomal amino acids are L-stereoisomers.'
    }
  },
  {
    id: 'sci_11',
    term: 'Hawking Radiation',
    field: 'Quantum Physics',
    pronunciation: 'HAW-king ray-dee-AY-shun',
    etymology: 'Named after British theoretical physicist Stephen Hawking',
    definition: 'Theoretical thermal blackbody radiation emitted just outside a black hole event horizon resulting from quantum vacuum fluctuations producing particle-antiparticle pairs.',
    breakthroughFact: 'Because Hawking radiation causes a black hole to steadily lose mass-energy, all isolated black holes will eventually evaporate completely into a burst of gamma-ray photons over astronomical cosmic timescales.',
    discoveryYear: '1974',
    discoverer: 'Stephen Hawking',
    realWorldImpact: 'Bridges quantum field theory with general relativity and ignited the fundamental Black Hole Information Paradox.',
    xpReward: 750,
    quiz: {
      question: 'What happens to the temperature of a black hole as it loses mass through Hawking radiation?',
      options: ['It gets hotter (negative heat capacity)', 'It cools down to absolute zero', 'It remains invariant', 'It drops logarithmically'],
      correctIndex: 0,
      explanation: 'Black holes have negative heat capacity: as they lose mass, their event horizon shrinks, Hawking temperature increases, and evaporation accelerates.'
    }
  },
  {
    id: 'sci_12',
    term: 'Mitochondrial Eve',
    field: 'Evolution',
    pronunciation: 'my-tuh-KAHN-dree-uhl EEV',
    etymology: 'Mitochondria (cellular organelle) + Eve',
    definition: 'The most recent matrilineal common ancestor from whom all living humans inherit their unbroken mitochondrial DNA (mtDNA) genome.',
    breakthroughFact: 'Mitochondrial Eve lived approximately 150,000 to 200,000 years ago in East Africa; because mtDNA undergoes no paternal recombination, mutations tick like a steady molecular clock.',
    discoveryYear: '1987',
    discoverer: 'Rebecca Cann, Mark Stoneking, Allan Wilson',
    realWorldImpact: 'Unequivocally confirmed the recent Out-of-Africa origin of anatomically modern Homo sapiens.',
    xpReward: 600,
    quiz: {
      question: 'Why is mitochondrial DNA passed down strictly from mother to offspring in human biology?',
      options: ['Sperm mitochondria are destroyed or discarded during fertilization', 'Male mitochondria lack DNA', 'Mitochondria recombine with Y chromosomes', 'mtDNA cannot survive in male cells'],
      correctIndex: 0,
      explanation: 'Sperm mitochondria in the flagellar tail are actively ubiquitinated and degraded upon egg penetration, leaving only maternal mitochondria in the zygote.'
    }
  }
];
