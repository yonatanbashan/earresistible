import { Profile } from './models/profile.model';
import { Injectable } from "@angular/core";

@Injectable()
export class ProfileService {


  getProfile() : Profile {
    return {
      authData: {
        username: 'yonatanbashan',
        email: 'yonatan.bashan@gmail.com'
      },
      artistName: 'Yonatan Bashan',
      imagePath: 'https://i.imgur.com/ImdbnCk.jpg',
      description: 'An electrock artist from Tel Aviv, Israel',
      bio: '',
      location: {
        country: 'Israel',
        city: 'Tel Aviv'
      },
      genre: {
        genre: 'Rock',
        subGenre: 'Electronic Rock'
      },
      releases: [
        {
          name: 'The Right Side',
          type: 'EP',
          imagePath: 'https://i.imgur.com/4JVWpL5.jpg',
          releaseDate: new Date(2015, 7, 25),
          items: [
            {
              name: 'Your Enemy',
              length: 235,
              filePath: ''
            },
            {
              name: 'The Right Side',
              length: 175,
              filePath: ''
            },
            {
              name: 'Time Of Me',
              length: 253,
              filePath: ''
            },
            {
              name: 'Gone',
              length: 325,
              filePath: ''
            },
            {
              name: 'People Like Us',
              length: 214,
              filePath: ''
            },
          ]
        },
        {
          name: 'The Astronaut',
          type: 'EP',
          imagePath: 'https://i.imgur.com/WOa26Rg.jpg',
          releaseDate: new Date(2019, 2, 12),
          items: [
            {
              name: 'The Astronaut',
              length: 250,
              filePath: ''
            },
            {
              name: 'Everything\'s Torn Deep Inside',
              length: 268,
              filePath: ''
            },
            {
              name: 'All The Time',
              length: 272,
              filePath: ''
            },
            {
              name: 'Stay Close',
              length: 251,
              filePath: ''
            },
            {
              name: 'Nightride',
              length: 218,
              filePath: ''
            },
          ]
        },

      ],
    }
  }

}
