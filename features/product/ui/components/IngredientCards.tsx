'use client'

interface IngredientCardsProps {
  ingredients: string
}

const knownIngredients: Record<string, string> = {
  'ácido hialurónico': 'Hidratación profunda',
  'ácido hialuronico': 'Hidratación profunda',
  'vitamina c': 'Iluminador natural',
  'retinol': 'Renovación celular',
  'niacinamida': 'Reduce poros visibles',
  'colágeno': 'Firmeza y elasticidad',
  'colageno': 'Firmeza y elasticidad',
  'ceramidas': 'Barrera protectora',
  'ceramida': 'Barrera protectora',
  'peptidos': 'Reparación celular',
  'peptido': 'Reparación celular',
  'ácido salicílico': 'Exfoliación suave',
  'acido salicilico': 'Exfoliación suave',
  'vitamina e': 'Antioxidante natural',
  'aceite de argán': 'Nutrición intensa',
  'aceite de argan': 'Nutrición intensa',
  'manteca de karité': 'Hidratación profunda',
  'manteca de karite': 'Hidratación profunda',
  'aloe vera': 'Calmante natural',
  'zinc': 'Protección solar',
  'óxido de zinc': 'Protección solar',
  'oxido de zinc': 'Protección solar',
}

export default function IngredientCards({ ingredients }: IngredientCardsProps) {
  const ingredientList = ingredients
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 6)

  if (ingredientList.length === 0) return null

  return (
    <div className="ingredient-cards">
      <h3 className="ingredient-cards-title">Ingredientes Clave</h3>
      <div className="ingredient-cards-grid">
        {ingredientList.map((ingredient, index) => {
          const benefit = knownIngredients[ingredient.toLowerCase()]
          return (
            <div key={index} className="ingredient-card-item">
              <div className="ingredient-card-text">
                <span className="ingredient-card-name">{ingredient}</span>
                {benefit && (
                  <span className="ingredient-card-benefit">{benefit}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
