import { gql } from '@apollo/client';

const UNSPLASH_IMAGES = gql`
  query ($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id,
      url,
      posterName,
      description,
      userPosted,
      binned,
    }
  }
`;

const BINNED_IMAGES = gql`
query {
  binnedImages {
    id,
    url,
    posterName,
    description,
    userPosted,
    binned,
    }
  }
`;

const USER_POSTED_IMAGES = gql `
  query {
    userPostedImages {
        id
        url
        posterName
        description
        userPosted
        binned
    }
  }
`;

const UPLOAD_IMAGE = gql `
mutation ($url: String!, $description: String, $posterName: String) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
        id
        url
        posterName
        description
        userPosted
        binned
    }
  }
`;

const UPDATE_IMAGE = gql `
mutation ($id: ID!, $url: String, $description: String, $posterName: String, $binned: Boolean, $userPosted: Boolean) {
    updateImage(id: $id, url: $url, description: $description, posterName: $posterName, binned: $binned, userPosted: $userPosted) {
        id
        url
        posterName
        description
        userPosted
        binned
    }
  }
`;

const DELETE_IMAGE = gql`
mutation ($id: ID!) {
    deleteImage(id: $id) {
        id
        url
        posterName
        description
        userPosted
        binned
    }
  }
`;

let exported = {
  UNSPLASH_IMAGES: UNSPLASH_IMAGES,
  BINNED_IMAGES: BINNED_IMAGES,
  USER_POSTED_IMAGES: USER_POSTED_IMAGES,
  UPLOAD_IMAGE: UPLOAD_IMAGE,
  UPDATE_IMAGE: UPDATE_IMAGE,
  DELETE_IMAGE: DELETE_IMAGE
};

export default exported;
