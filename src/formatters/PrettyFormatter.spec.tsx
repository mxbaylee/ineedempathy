import { CardPileDef, urlDecode, urlEncode } from './PrettyFormatter'

describe('PrettyFormatter', () => {
  it('urlEncode', () => {
    const items: CardPileDef[][] = [[1,2,3],[4,5,6]]
    expect(decodeURIComponent(urlEncode(items))).toEqual("[[1,2,3],[4,5,6]]")
  })

  describe('urlDecode', () => {
    it('decodes json', () => {
      const url: string = "#[[1,2,3],[4,5,6]]"
      expect(urlDecode(url)).toEqual([[1,2,3],[4,5,6]])
    })

    it('decodes encoded json', () => {
      const items: CardPileDef[][] = [[1,2,3],[4,5,6]]
      expect(urlDecode('#' + urlEncode(items))).toEqual([[1,2,3],[4,5,6]])
    })

    it('returns false for invalid', () => {
      const url: string = "#]"
      expect(urlDecode(url)).toEqual(false)
    })
  })
})
