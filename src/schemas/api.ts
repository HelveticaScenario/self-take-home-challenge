import * as z from 'zod'

const PropertiesSchema = z
  .object({
    accuracy: z
      .enum([
        'rooftop',
        'parcel',
        'point',
        'interpolated',
        'intersection',
        'street',
      ])
      .optional(),
    address: z.string(),
    category: z.string(),
    maki: z.string(),
    landmark: z.literal(true),
    wikidata: z.string(),
    short_code: z.string(),
    tel: z.string(),
  })
  .partial()

const GeometrySchema = z
  .object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
    // interpolated: z.boolean().optional(),
    // omitted: z.boolean().optional(),
  })
  .nonstrict()

const FeaturesSchema = z
  .object({
    // id: z.string(),
    // type: z.literal('Feature'),
    // place_type: z.array(z.string()),
    // relevance: z.number(),
    // address: z.string().optional(),
    // properties: PropertiesSchema,
    // text: z.string(),
    place_name: z.string(),
    // matching_text: z.string().optional(),
    // matching_place_name: z.string().optional(),
    // language: z.string().optional(),
    // bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    // center: z.tuple([z.number(), z.number()]),
    geometry: GeometrySchema,
    // routable_points: z
    //   .object({
    //     points: z
    //       .array(z.object({ coordinates: z.tuple([z.number(), z.number()]) }))
    //       .optional(),
    //   })
    //   .optional(),
  })
  .nonstrict()

export const MapboxGeocodingResponseSchema = z.object({
  type: z.literal('FeatureCollection'),
  query: z.union([z.array(z.string()), z.tuple([z.number(), z.number()])]),
  features: z.array(
    FeaturesSchema.merge(
      z.object({
        context: z.array(
          FeaturesSchema.merge(PropertiesSchema).merge(GeometrySchema).partial()
        ),
      })
    )
  ),
  attribution: z.string(),
})

export type IMapboxSearchResponse = z.infer<
  typeof MapboxGeocodingResponseSchema
>

export const OpenWeatherResponseSchema = z
  .object({
    current: z
      .object({
        sunrise: z.number(),
        sunset: z.number(),
        pressure: z.number(),
        humidity: z.number(),
        temp: z.number(),
        weather: z.array(
          z.object({
            id: z.number(),
            main: z.string(),
            description: z.string(),
            icon: z.string(),
          })
        ),
      })
      .nonstrict(),
  })
  .nonstrict()

export type IOpenWeatherResponse = z.infer<typeof OpenWeatherResponseSchema>

export const CitySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  sunrise: z.number(),
  sunset: z.number(),
  weather: z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string(),
    pressure: z.number(),
    humidity: z.number(),
    temp: z.number(),
  }),
})

export type ICity = z.infer<typeof CitySchema>

export const SearchRequestSchema = z.object({
  search_text: z.string(),
})

export type ISearchRequest = z.infer<typeof SearchRequestSchema>

export const ReverseSearchRequestSchema = z.object({
  lon: z.number(),
  lat: z.number(),
})

export type IReverseSearchRequest = z.infer<typeof ReverseSearchRequestSchema>

const LocationSchema = z.object({
  name: z.string(),
  coordinates: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
})

export const PlaceWithWeatherSchema = z.object({
  weather: z.object({
    main: z.string(),
    description: z.string(),
    icon: z.string(),
    temp: z.number(),
  }),
  location: LocationSchema,
})

export type IPlaceWithWeather = z.infer<typeof PlaceWithWeatherSchema>

export const SearchResponseSchema = z.array(PlaceWithWeatherSchema)

export type ISearchResponse = z.infer<typeof SearchResponseSchema>

export const ReverseSearchResponseSchema = z.object({
  name: z.string().optional(),
})

export type IReverseSearchResponse = z.infer<typeof ReverseSearchResponseSchema>

export const SignUpSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export type ISignUp = z.infer<typeof SignUpSchema>

export const PostCityRequestSchema = LocationSchema

export type IPostCityRequest = z.infer<typeof PostCityRequestSchema>

export const PostCityResponseSchema = CitySchema

export type IPostCityResponse = z.infer<typeof PostCityResponseSchema>

export const DeleteCityRequestSchema = z.object({
  cityId: z.string(),
})

export type IDeleteCityRequest = z.infer<typeof DeleteCityRequestSchema>

export const WeatherResponseSchema = z.object({
  cities: z.array(CitySchema),
})
