import {Component} from 'react'

import {BsGrid3X3} from 'react-icons/bs'

import {BiCamera} from 'react-icons/bi'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import InstaContext from '../../Context/InstaContext'

import SearchResult from '../SearchResult'

import './index.css'

class UserProfile extends Component {
  state = {status: 'INITIAL', userData: {}}

  componentDidMount() {
    this.getUserData()
  }

  getUserData = async () => {
    this.setState({status: 'LOADING'})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const ApiUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(ApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const rawProfileData = data.user_details
      const userData = {
        followersCount: rawProfileData.followers_count,
        followingCount: rawProfileData.following_count,
        id: rawProfileData.id,
        posts: rawProfileData.posts,
        postsCount: rawProfileData.posts_count,
        profilePic: rawProfileData.profile_pic,
        stories: rawProfileData.stories,
        userBio: rawProfileData.user_bio,
        userId: rawProfileData.user_id,
        username: rawProfileData.user_name,
      }

      this.setState({userData, status: 'SUCCESS'})
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  renderUserProfileLoading = () => (
    <div className="user-profile-loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderUserNoPostsView = () => (
    <div className="user-profile-no-posts">
      <BiCamera />
      <h1>No Posts Yet</h1>
    </div>
  )

  renderUserPostView = () => {
    const {userData} = this.state
    const {posts} = userData

    return (
      <div className="user-profile-post-card">
        {posts.map(each => (
          <li className="user-post-list" key={each.id}>
            <img src={each.image} alt="user post" className="user-post-image" />
          </li>
        ))}
      </div>
    )
  }

  renderUserProfileSuccessView = () => {
    const {userData} = this.state

    return (
      <div className="user-profile-success-container">
        <div className="user-profile-details-container">
          <img
            src={userData.profilePic}
            alt="user profile"
            className="user-profile-image"
          />
          <div>
            <h1 className="user-profile-name">{userData.username}</h1>
            <div className="user-profile-following-card">
              <p className="user-profile-post-count">
                {userData.postsCount} posts
              </p>
              <p className="user-profile-post-count">
                {userData.followersCount} followers
              </p>
              <p className="user-profile-post-count">
                {userData.followingCount} following
              </p>
            </div>
            <p className="user-profile-post-count">{userData.userId}</p>
            <p className="user-profile-post-bio">{userData.userBio}</p>
          </div>
        </div>

        <ul className="user-profile-stories-card">
          {userData.stories.map(each => (
            <li key={each.id} className="user-profile-story">
              <img
                src={each.image}
                alt="user story"
                className="user-profile-story-img"
              />
            </li>
          ))}
        </ul>
        <hr className="user-profile-hr-line" />
        <div className="user-posts-top-card">
          <div>
            <BsGrid3X3 className="user-posts-grid" />
          </div>
          <h1 className="posts">Posts</h1>
        </div>

        {userData.postsCount > 0 ? (
          this.renderUserPostView()
        ) : (
          <div>
            {' '}
            <BiCamera />
            <h1>No Posts Yet</h1>
          </div>
        )}
      </div>
    )
  }

  renderUserProfileFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/du6aueulp/image/upload/v1699689961/tgr3k1fh3luixvqn37n4.png"
        alt="failure view"
        className="failure-img"
      />
      <p>Something went wrong. Please try again</p>
      <button
        className="failure-button"
        type="button"
        onClick={this.getUserData}
      >
        Try Again
      </button>
    </div>
  )

  renderUserProfile = () => {
    const {status} = this.state

    switch (status) {
      case 'LOADING':
        return this.renderUserProfileLoading()
      case 'FAILURE':
        return this.renderUserProfileFailureView()
      case 'SUCCESS':
        return this.renderUserProfileSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <InstaContext.Consumer>
        {value => {
          const {searchStatus} = value
          return (
            <>
              <Header />
              {searchStatus ? (
                <SearchResult />
              ) : (
                <div className="user-profile-container">
                  {this.renderUserProfile()}
                </div>
              )}
            </>
          )
        }}
      </InstaContext.Consumer>
    )
  }
}

export default UserProfile
